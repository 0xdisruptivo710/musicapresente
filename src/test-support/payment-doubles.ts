import { Payment, type PaymentProps } from '@/core/domain/entities/payment';
import type { PaymentRepository } from '@/core/ports/repositories/payment-repository';
import type {
  CreatePixChargeParams,
  PaymentGateway,
  PixChargeResult,
} from '@/core/ports/gateways/payment-gateway';

export class InMemoryPaymentRepository implements PaymentRepository {
  readonly saved: PaymentProps[] = [];

  async create(payment: Payment): Promise<void> {
    this.saved.push(payment.toPrimitives());
  }

  async update(payment: Payment): Promise<void> {
    const index = this.saved.findIndex((p) => p.id === payment.id);
    if (index >= 0) this.saved[index] = payment.toPrimitives();
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<Payment | null> {
    const found = this.saved
      .filter((p) => p.tenantId === tenantId && p.orderId === orderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    return found ? Payment.restore(found) : null;
  }

  async findByChargeId(abacatepayId: string): Promise<Payment | null> {
    const found = this.saved.find((p) => p.abacatepayId === abacatepayId);
    return found ? Payment.restore(found) : null;
  }
}

/** Gateway de pagamento falso (determinístico), não chama a AbacatePay. */
export class FakePaymentGateway implements PaymentGateway {
  readonly calls: CreatePixChargeParams[] = [];
  chargeId = 'charge-fake-1';

  async createPixCharge(params: CreatePixChargeParams): Promise<PixChargeResult> {
    this.calls.push(params);
    return {
      chargeId: this.chargeId,
      brCode: '00020126BR.GOV.BCB.PIX',
      brCodeBase64: 'data:image/png;base64,FAKE',
      status: 'pending',
      expiresAt: null,
    };
  }
}
