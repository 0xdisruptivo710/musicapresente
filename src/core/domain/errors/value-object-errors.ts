import { DomainError } from './domain-error';

export class InvalidMoneyError extends DomainError {
  readonly code = 'INVALID_MONEY';
  override readonly httpStatus = 422;
}

export class InvalidWhatsAppNumberError extends DomainError {
  readonly code = 'INVALID_WHATSAPP_NUMBER';
  override readonly httpStatus = 422;
}
