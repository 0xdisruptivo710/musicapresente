import type { PaymentStatus } from '@/core/domain/value-objects/payment-status';

export interface PixCustomer {
  name: string;
  email: string;
  taxId: string;
  cellphone: string;
}

export interface CreatePixChargeParams {
  amountCents: number;
  description: string;
  expiresInSeconds: number;
  /** Referência externa (= orderId), volta no webhook para mapear o pedido. */
  externalId: string;
  customer?: PixCustomer;
}

export interface PixChargeResult {
  chargeId: string;
  brCode: string;
  brCodeBase64: string;
  status: PaymentStatus;
  expiresAt: Date | null;
}

/**
 * Cobrança PIX via provedor (CLAUDE.md §7.2). Implementação: AbacatePay
 * (Checkout Transparente). Trocável por interface.
 */
export interface PaymentGateway {
  createPixCharge(params: CreatePixChargeParams): Promise<PixChargeResult>;
}
