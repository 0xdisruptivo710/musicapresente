import { Money } from '@/core/domain/value-objects/money';
import { Payment } from '@/core/domain/entities/payment';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { PaymentRepository } from '@/core/ports/repositories/payment-repository';
import type { PackageRepository } from '@/core/ports/repositories/package-repository';
import type { PaymentGateway, PixCustomer } from '@/core/ports/gateways/payment-gateway';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import { CannotCreateChargeError } from '@/core/domain/errors/payment-errors';

export interface CreatePixChargeInput {
  tenantId: string;
  orderId: string;
  packageId?: string;
  addonCodes?: string[];
  customer?: PixCustomer;
}

export interface CreatePixChargeOutput {
  brCode: string;
  brCodeBase64: string;
  amountCents: number;
  expiresAt: string | null;
}

/**
 * Cria a cobrança PIX (AbacatePay) de um pedido com a prévia pronta e transiciona
 * PREVIEW_READY → AWAITING_PAYMENT. CLAUDE.md §5.3, §7.2.
 */
export class CreatePixChargeUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly payments: PaymentRepository,
    private readonly packages: PackageRepository,
    private readonly gateway: PaymentGateway,
    private readonly fallbackPriceCents: number,
  ) {}

  async execute(input: CreatePixChargeInput): Promise<CreatePixChargeOutput> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }
    if (order.status !== 'preview_ready' && order.status !== 'awaiting_payment') {
      throw new CannotCreateChargeError(
        `Não é possível cobrar com o pedido em "${order.status}".`,
      );
    }

    // Preço a partir do pacote escolhido; sem pacote, usa o valor padrão.
    let priceCents = this.fallbackPriceCents;
    if (input.packageId) {
      const pkg = await this.packages.findById(input.tenantId, input.packageId);
      if (!pkg) {
        throw new CannotCreateChargeError('Pacote inválido para este pedido.');
      }
      const addonCodes = input.addonCodes ?? [];
      priceCents = pkg.priceWithAddons(addonCodes);
      order.choosePackage(input.packageId, addonCodes);
    }

    const charge = await this.gateway.createPixCharge({
      amountCents: priceCents,
      description: `Musica Presente - musica personalizada (pedido #${order.orderNumber ?? ''})`,
      expiresInSeconds: 3600,
      externalId: input.orderId,
      customer: input.customer,
    });

    const payment = Payment.create({
      tenantId: input.tenantId,
      orderId: input.orderId,
      amountCents: priceCents,
      abacatepayId: charge.chargeId,
      brCode: charge.brCode,
      brCodeBase64: charge.brCodeBase64,
      expiresAt: charge.expiresAt,
      status: charge.status,
    });
    await this.payments.create(payment);

    if (order.status === 'preview_ready') {
      order.awaitPayment(Money.fromCents(priceCents));
    }
    await this.orders.update(order);

    return {
      brCode: charge.brCode,
      brCodeBase64: charge.brCodeBase64,
      amountCents: priceCents,
      expiresAt: charge.expiresAt ? charge.expiresAt.toISOString() : null,
    };
  }
}
