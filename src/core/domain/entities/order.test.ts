import { describe, it, expect } from 'vitest';
import { Order } from './order';
import { Money } from '@/core/domain/value-objects/money';
import { WhatsAppNumber } from '@/core/domain/value-objects/whatsapp-number';
import { InvalidOrderTransitionError } from '@/core/domain/errors/order-errors';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('Order', () => {
  it('nasce em draft', () => {
    const order = Order.create({ tenantId: TENANT });
    expect(order.status).toBe('draft');
    expect(order.tenantId).toBe(TENANT);
    expect(order.whatsapp).toBeNull();
  });

  it('percorre o caminho feliz até delivered', () => {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    order.startLyrics();
    order.markLyricsReady();
    order.startMusic();
    order.markPreviewReady();
    order.awaitPayment(Money.fromCents(7990));
    expect(order.status).toBe('awaiting_payment');
    expect(order.amountCents).toBe(7990);
    order.markPaid();
    order.markDelivered();
    expect(order.status).toBe('delivered');
  });

  it('rejeita transição inválida (draft → paid)', () => {
    const order = Order.create({ tenantId: TENANT });
    expect(() => order.markPaid()).toThrow(InvalidOrderTransitionError);
    expect(order.status).toBe('draft');
  });

  it('captura whatsapp já normalizado', () => {
    const order = Order.create({ tenantId: TENANT });
    order.captureWhatsApp(WhatsAppNumber.create('(31) 99999-8888'));
    expect(order.whatsapp).toBe('5531999998888');
  });
});
