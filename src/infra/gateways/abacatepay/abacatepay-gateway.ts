import 'server-only';
import { env } from '@/shared/config/env';
import type {
  CreatePixChargeParams,
  PaymentGateway,
  PixChargeResult,
} from '@/core/ports/gateways/payment-gateway';
import type { PaymentStatus } from '@/core/domain/value-objects/payment-status';
import { PaymentGatewayError } from '@/core/domain/errors/payment-errors';

/** Normaliza o status textual da AbacatePay → PaymentStatus. */
export function normalizeAbacateStatus(raw: unknown): PaymentStatus {
  const value = String(raw ?? '').toUpperCase();
  if (value === 'PAID' || value === 'COMPLETE') return 'paid';
  if (value === 'EXPIRED') return 'expired';
  if (value === 'CANCELLED') return 'cancelled';
  if (value === 'REFUNDED') return 'refunded';
  if (value === 'FAILED') return 'failed';
  return 'pending';
}

/** Cobrança PIX via AbacatePay (Checkout Transparente, /v2/transparents/create). */
export class AbacatePayGateway implements PaymentGateway {
  async createPixCharge(params: CreatePixChargeParams): Promise<PixChargeResult> {
    const apiKey = env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      throw new PaymentGatewayError('ABACATEPAY_API_KEY não configurada.');
    }

    const body: Record<string, unknown> = {
      method: 'PIX',
      data: {
        amount: params.amountCents,
        description: params.description.slice(0, 500),
        expiresIn: params.expiresInSeconds,
        externalId: params.externalId,
        metadata: { orderId: params.externalId },
        ...(params.customer ? { customer: params.customer } : {}),
      },
    };

    let response: Response;
    try {
      response = await fetch(`${env.ABACATEPAY_BASE_URL}/transparents/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (cause) {
      throw new PaymentGatewayError(`Falha de rede ao chamar a AbacatePay: ${String(cause)}`);
    }

    const json = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: unknown;
      data?: {
        id?: unknown;
        brCode?: unknown;
        brCodeBase64?: unknown;
        status?: unknown;
        expiresAt?: unknown;
      };
    } | null;

    if (!response.ok || json?.success === false || !json?.data) {
      const detail = JSON.stringify(json?.error ?? response.status);
      throw new PaymentGatewayError(`AbacatePay respondeu ${response.status}: ${detail}`.slice(0, 200));
    }

    const data = json.data;
    if (typeof data.id !== 'string' || typeof data.brCode !== 'string') {
      throw new PaymentGatewayError('Resposta da AbacatePay sem id/brCode.');
    }

    return {
      chargeId: data.id,
      brCode: data.brCode,
      brCodeBase64: typeof data.brCodeBase64 === 'string' ? data.brCodeBase64 : '',
      status: normalizeAbacateStatus(data.status),
      expiresAt: typeof data.expiresAt === 'string' ? new Date(data.expiresAt) : null,
    };
  }
}
