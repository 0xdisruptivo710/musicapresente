import { Order } from '@/core/domain/entities/order';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';

export interface CreateOrderInput {
  tenantId: string;
  customerId?: string | null;
}

export interface CreateOrderOutput {
  orderId: string;
}

/** Abre uma nova sessão do funil (Order em DRAFT). CLAUDE.md §5.3. */
export class CreateOrderUseCase {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = Order.create({
      tenantId: input.tenantId,
      customerId: input.customerId ?? null,
    });
    await this.orders.create(order);
    return { orderId: order.id };
  }
}
