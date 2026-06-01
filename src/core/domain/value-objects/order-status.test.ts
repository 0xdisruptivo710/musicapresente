import { describe, it, expect } from 'vitest';
import { canTransition, isTerminal } from './order-status';

describe('order-status (máquina de estados)', () => {
  it('permite o caminho feliz completo', () => {
    expect(canTransition('draft', 'quiz_completed')).toBe(true);
    expect(canTransition('quiz_completed', 'lyrics_generating')).toBe(true);
    expect(canTransition('lyrics_generating', 'lyrics_ready')).toBe(true);
    expect(canTransition('lyrics_ready', 'music_generating')).toBe(true);
    expect(canTransition('music_generating', 'preview_ready')).toBe(true);
    expect(canTransition('preview_ready', 'awaiting_payment')).toBe(true);
    expect(canTransition('awaiting_payment', 'paid')).toBe(true);
    expect(canTransition('paid', 'delivered')).toBe(true);
  });

  it('permite ramos de falha/expiração/estorno', () => {
    expect(canTransition('lyrics_generating', 'failed')).toBe(true);
    expect(canTransition('music_generating', 'failed')).toBe(true);
    expect(canTransition('awaiting_payment', 'expired')).toBe(true);
    expect(canTransition('paid', 'refunded')).toBe(true);
  });

  it('bloqueia pulos inválidos', () => {
    expect(canTransition('draft', 'paid')).toBe(false);
    expect(canTransition('preview_ready', 'paid')).toBe(false);
    expect(canTransition('delivered', 'paid')).toBe(false);
  });

  it('reconhece estados terminais', () => {
    expect(isTerminal('delivered')).toBe(true);
    expect(isTerminal('refunded')).toBe(true);
    expect(isTerminal('expired')).toBe(true);
    expect(isTerminal('failed')).toBe(true);
    expect(isTerminal('draft')).toBe(false);
  });
});
