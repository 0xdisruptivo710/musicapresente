import type { Payment } from '@/core/domain/entities/payment';

/** Persistência das cobranças. */
export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  findByOrderId(tenantId: string, orderId: string): Promise<Payment | null>;
  /** Busca global pelo id da cobrança AbacatePay (webhook não traz tenant). */
  findByChargeId(abacatepayId: string): Promise<Payment | null>;
}
