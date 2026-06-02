import { describe, it, expect, beforeEach } from 'vitest';
import { HandlePaymentWebhookUseCase } from './handle-payment-webhook.use-case';
import { Order } from '@/core/domain/entities/order';
import { Payment } from '@/core/domain/entities/payment';
import { Song } from '@/core/domain/entities/song';
import { Money } from '@/core/domain/value-objects/money';
import { InMemoryOrderRepository } from '@/test-support/in-memory-repositories';
import { InMemorySongRepository } from '@/test-support/music-doubles';
import { InMemoryPaymentRepository } from '@/test-support/payment-doubles';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('HandlePaymentWebhookUseCase', () => {
  let orders: InMemoryOrderRepository;
  let payments: InMemoryPaymentRepository;
  let songs: InMemorySongRepository;
  let useCase: HandlePaymentWebhookUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    payments = new InMemoryPaymentRepository();
    songs = new InMemorySongRepository();
    useCase = new HandlePaymentWebhookUseCase(orders, payments, songs);
  });

  async function seedAwaitingPayment(): Promise<string> {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    order.startLyrics();
    order.markLyricsReady();
    order.startMusic('task-x');
    order.markPreviewReady();
    order.awaitPayment(Money.fromCents(3990));
    await orders.create(order);
    await payments.create(
      Payment.create({ tenantId: TENANT, orderId: order.id, amountCents: 3990, abacatepayId: 'charge-1' }),
    );
    await songs.saveMany([
      Song.create({ tenantId: TENANT, orderId: order.id, version: 'v1', sunoAudioUrl: 'u1' }),
      Song.create({ tenantId: TENANT, orderId: order.id, version: 'v2', sunoAudioUrl: 'u2' }),
    ]);
    return order.id;
  }

  it('paga o pedido e libera as músicas (mapeando por externalId)', async () => {
    const orderId = await seedAwaitingPayment();
    await useCase.execute({ chargeId: null, externalId: orderId, paid: true, refunded: false });

    expect((await orders.findById(TENANT, orderId))?.status).toBe('paid');
    expect((await payments.findByOrderId(TENANT, orderId))?.status).toBe('paid');
    expect(songs.saved.filter((s) => s.orderId === orderId).every((s) => s.locked === false)).toBe(true);
  });

  it('mapeia também pelo chargeId', async () => {
    const orderId = await seedAwaitingPayment();
    await useCase.execute({ chargeId: 'charge-1', externalId: null, paid: true, refunded: false });
    expect((await orders.findById(TENANT, orderId))?.status).toBe('paid');
  });

  it('é idempotente (callback duplicado não quebra)', async () => {
    const orderId = await seedAwaitingPayment();
    const payload = { chargeId: null, externalId: orderId, paid: true, refunded: false };
    await useCase.execute(payload);
    await useCase.execute(payload);
    expect((await orders.findById(TENANT, orderId))?.status).toBe('paid');
  });

  it('ignora taskId/charge desconhecido', async () => {
    await seedAwaitingPayment();
    await useCase.execute({ chargeId: 'inexistente', externalId: null, paid: true, refunded: false });
    // nada paga
    expect(payments.saved.every((p) => p.status === 'pending')).toBe(true);
  });
});
