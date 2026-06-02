import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { PaymentRepository } from '@/core/ports/repositories/payment-repository';
import type { SongRepository } from '@/core/ports/repositories/song-repository';

export interface HandlePaymentWebhookInput {
  /** id da cobrança na AbacatePay. */
  chargeId: string | null;
  /** referência externa que enviamos (= orderId). */
  externalId: string | null;
  paid: boolean;
  refunded: boolean;
}

/**
 * Processa o webhook da AbacatePay (transparent.completed/refunded). Ao pagar:
 * marca o Payment, transiciona o pedido → PAID e libera as músicas (unlock).
 * Idempotente (callbacks duplicados não re-processam). CLAUDE.md §8, §9.
 */
export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly payments: PaymentRepository,
    private readonly songs: SongRepository,
  ) {}

  async execute(input: HandlePaymentWebhookInput): Promise<void> {
    // Mapeia o pedido: por externalId (= orderId) e, em fallback, pelo chargeId.
    let order = input.externalId ? await this.orders.findByIdGlobal(input.externalId) : null;
    let payment = order ? await this.payments.findByOrderId(order.tenantId, order.id) : null;

    if (!payment && input.chargeId) {
      payment = await this.payments.findByChargeId(input.chargeId);
      if (payment && !order) {
        order = await this.orders.findById(payment.tenantId, payment.orderId);
      }
    }

    if (!order || !payment) return; // não mapeado — ignora

    if (input.refunded) {
      if (payment.status === 'refunded') return; // idempotência
      payment.markRefunded();
      await this.payments.update(payment);
      if (order.status === 'paid') {
        order.refund();
        await this.orders.update(order);
      }
      return;
    }

    if (input.paid) {
      if (payment.status === 'paid') return; // idempotência
      payment.markPaid();
      await this.payments.update(payment);
      if (order.status === 'awaiting_payment') {
        order.markPaid();
        await this.orders.update(order);
        await this.songs.unlockByOrderId(order.tenantId, order.id);
      }
    }
  }
}
