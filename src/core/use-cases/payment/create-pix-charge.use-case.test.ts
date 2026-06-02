import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePixChargeUseCase } from './create-pix-charge.use-case';
import { Order } from '@/core/domain/entities/order';
import { CannotCreateChargeError } from '@/core/domain/errors/payment-errors';
import { InMemoryOrderRepository } from '@/test-support/in-memory-repositories';
import { FakePaymentGateway, InMemoryPaymentRepository } from '@/test-support/payment-doubles';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('CreatePixChargeUseCase', () => {
  let orders: InMemoryOrderRepository;
  let payments: InMemoryPaymentRepository;
  let gateway: FakePaymentGateway;
  let useCase: CreatePixChargeUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    payments = new InMemoryPaymentRepository();
    gateway = new FakePaymentGateway();
    useCase = new CreatePixChargeUseCase(orders, payments, gateway, 3990);
  });

  async function seedPreviewReady(): Promise<string> {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    order.startLyrics();
    order.markLyricsReady();
    order.startMusic('task-x');
    order.markPreviewReady();
    await orders.create(order);
    return order.id;
  }

  it('cria a cobrança PIX e move o pedido para awaiting_payment', async () => {
    const orderId = await seedPreviewReady();
    const out = await useCase.execute({ tenantId: TENANT, orderId });

    expect(out.amountCents).toBe(3990);
    expect(out.brCode).toBeTruthy();
    expect(gateway.calls[0]?.amountCents).toBe(3990);
    expect(gateway.calls[0]?.externalId).toBe(orderId);
    expect((await orders.findById(TENANT, orderId))?.status).toBe('awaiting_payment');
    expect((await payments.findByOrderId(TENANT, orderId))?.status).toBe('pending');
  });

  it('recusa quando o pedido não está com a prévia pronta', async () => {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    await orders.create(order);
    await expect(
      useCase.execute({ tenantId: TENANT, orderId: order.id }),
    ).rejects.toBeInstanceOf(CannotCreateChargeError);
  });
});
