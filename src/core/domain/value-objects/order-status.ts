/**
 * Máquina de estados do pedido (CLAUDE.md §5.2).
 * Os valores batem 1:1 com o enum `cancao.order_status` no banco.
 * Transições só acontecem dentro da entidade Order, orquestradas por Use Cases.
 */
export const ORDER_STATUSES = [
  'draft',
  'quiz_completed',
  'lyrics_generating',
  'lyrics_ready',
  'music_generating',
  'preview_ready',
  'awaiting_payment',
  'paid',
  'delivered',
  'failed',
  'expired',
  'refunded',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  draft: ['quiz_completed'],
  quiz_completed: ['lyrics_generating'],
  lyrics_generating: ['lyrics_ready', 'failed'],
  lyrics_ready: ['music_generating'],
  music_generating: ['preview_ready', 'failed'],
  preview_ready: ['awaiting_payment'],
  awaiting_payment: ['paid', 'expired'],
  paid: ['delivered', 'refunded'],
  delivered: [],
  failed: [],
  expired: [],
  refunded: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[from];
}

export function isTerminal(status: OrderStatus): boolean {
  return TRANSITIONS[status].length === 0;
}
