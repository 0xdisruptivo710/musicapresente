import type { Order } from '@/core/domain/entities/order';
import type { OrderStatus } from '@/core/domain/value-objects/order-status';

/** Forma do pedido exposta pela API (sem vazar internals como tenant_id). */
export interface OrderDTO {
  id: string;
  status: OrderStatus;
  orderNumber: number | null;
  packageId: string | null;
  whatsapp: string | null;
  amountCents: number | null;
}

export function toOrderDTO(order: Order): OrderDTO {
  return {
    id: order.id,
    status: order.status,
    orderNumber: order.orderNumber,
    packageId: order.packageId,
    whatsapp: order.whatsapp,
    amountCents: order.amountCents,
  };
}
