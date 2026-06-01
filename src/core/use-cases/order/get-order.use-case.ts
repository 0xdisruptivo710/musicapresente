import type { Order } from '@/core/domain/entities/order';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';

export interface GetOrderInput {
  tenantId: string;
  orderId: string;
}

/** Busca um pedido escopado por tenant; lança se não existir. CLAUDE.md §5.3. */
export class GetOrderUseCase {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: GetOrderInput): Promise<Order> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }
    return order;
  }
}
