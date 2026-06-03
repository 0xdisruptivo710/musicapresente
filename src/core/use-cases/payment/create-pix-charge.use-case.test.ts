import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePixChargeUseCase } from './create-pix-charge.use-case';
import { Order } from '@/core/domain/entities/order';
import { CannotCreateChargeError } from '@/core/domain/errors/payment-errors';
import { InMemoryOrderRepository } from '@/test-support/in-memory-repositories';
import { FakePaymentGateway, InMemoryPaymentRepository } from '@/test-support/payment-doubles';
import { InMemoryPackageRepository } from '@/test-support/package-doubles';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('CreatePixChargeUseCase', () => {
  let orders: InMemoryOrderRepository;
  let payments: InMemoryPaymentRepository;
  let packages: InMemoryPackageRepository;
  let gateway: FakePaymentGateway;
  let useCase: CreatePixChargeUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    payments = new InMemoryPaymentRepository();
    packages = new InMemoryPackageRepository();
    gateway = new FakePaymentGateway();
    useCase = new CreatePixChargeUseCase(orders, payments, packages, gateway, 3990);
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

  it('usa o preço do pacote + add-on quando packageId é informado', async () => {
    const orderId = await seedPreviewReady();
    packages.seed({
      id: 'pkg-1',
      tenantId: TENANT,
      code: 'music_site',
      name: 'Música + Site',
      description: null,
      basePriceCents: 8990,
      compareAtPriceCents: 15990,
      features: [],
      addons: [
        { code: 'photos_5', name: '5 fotos', priceCents: 0, isDefault: true },
        { code: 'photos_20', name: '20 fotos', priceCents: 1000, isDefault: false },
      ],
      isActive: true,
      sortOrder: 2,
    });

    const out = await useCase.execute({
      tenantId: TENANT,
      orderId,
      packageId: 'pkg-1',
      addonCodes: ['photos_20'],
    });

    expect(out.amountCents).toBe(9990); // 8990 + 1000
    expect(gateway.calls[0]?.amountCents).toBe(9990);
    const order = await orders.findById(TENANT, orderId);
    expect(order?.status).toBe('awaiting_payment');
    expect(order?.amountCents).toBe(9990);
    expect(order?.packageId).toBe('pkg-1');
  });

  it('recusa packageId inexistente', async () => {
    const orderId = await seedPreviewReady();
    await expect(
      useCase.execute({ tenantId: TENANT, orderId, packageId: 'nao-existe' }),
    ).rejects.toBeInstanceOf(CannotCreateChargeError);
  });
});
