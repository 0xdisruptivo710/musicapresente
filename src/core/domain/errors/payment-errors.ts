import { DomainError } from './domain-error';

/** Estado do pedido não permite criar cobrança (precisa de prévia pronta). */
export class CannotCreateChargeError extends DomainError {
  readonly code = 'CANNOT_CREATE_CHARGE';
  override readonly httpStatus = 409;
}

/** Falha ao criar a cobrança no provedor (ex.: AbacatePay fora do ar). */
export class PaymentGatewayError extends DomainError {
  readonly code = 'PAYMENT_GATEWAY_FAILED';
  override readonly httpStatus = 502;
}
