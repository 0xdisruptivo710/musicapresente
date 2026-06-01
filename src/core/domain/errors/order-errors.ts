import { DomainError } from './domain-error';
import type { OrderStatus } from '@/core/domain/value-objects/order-status';

export class OrderNotFoundError extends DomainError {
  readonly code = 'ORDER_NOT_FOUND';
  override readonly httpStatus = 404;

  constructor(orderId: string) {
    super(`Pedido não encontrado: ${orderId}`);
  }
}

export class InvalidOrderTransitionError extends DomainError {
  readonly code = 'INVALID_ORDER_TRANSITION';
  override readonly httpStatus = 409;

  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Transição de pedido inválida: ${from} → ${to}`);
  }
}
