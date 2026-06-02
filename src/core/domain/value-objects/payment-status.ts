/** Status do pagamento. Bate com o enum `cancao.payment_status`. */
export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'expired',
  'cancelled',
  'refunded',
  'failed',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
