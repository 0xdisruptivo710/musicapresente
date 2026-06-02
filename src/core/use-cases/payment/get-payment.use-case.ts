import type { Payment } from '@/core/domain/entities/payment';
import type { PaymentRepository } from '@/core/ports/repositories/payment-repository';

/** Última cobrança de um pedido (para o front fazer polling do status). */
export class GetPaymentUseCase {
  constructor(private readonly payments: PaymentRepository) {}

  execute(input: { tenantId: string; orderId: string }): Promise<Payment | null> {
    return this.payments.findByOrderId(input.tenantId, input.orderId);
  }
}
