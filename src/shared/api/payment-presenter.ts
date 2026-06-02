import type { Payment } from '@/core/domain/entities/payment';
import type { PaymentStatus } from '@/core/domain/value-objects/payment-status';

/** Forma da cobrança exposta pela API (para a tela de pagamento). */
export interface PaymentDTO {
  status: PaymentStatus;
  amountCents: number;
  brCode: string | null;
  brCodeBase64: string | null;
  expiresAt: string | null;
}

export function toPaymentDTO(payment: Payment): PaymentDTO {
  const p = payment.toPrimitives();
  return {
    status: p.status,
    amountCents: p.amountCents,
    brCode: p.brCode,
    brCodeBase64: p.brCodeBase64,
    expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
  };
}
