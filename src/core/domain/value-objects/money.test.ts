import { describe, it, expect } from 'vitest';
import { Money } from './money';
import { InvalidMoneyError } from '@/core/domain/errors/value-object-errors';

describe('Money', () => {
  it('cria a partir de centavos inteiros', () => {
    expect(Money.fromCents(6990).cents).toBe(6990);
  });

  it('rejeita centavos não-inteiros', () => {
    expect(() => Money.fromCents(99.9)).toThrow(InvalidMoneyError);
  });

  it('rejeita valores negativos', () => {
    expect(() => Money.fromCents(-1)).toThrow(InvalidMoneyError);
  });

  it('soma e subtrai', () => {
    expect(Money.fromCents(6990).add(Money.fromCents(1000)).cents).toBe(7990);
    expect(Money.fromCents(7990).subtract(Money.fromCents(1000)).cents).toBe(6990);
  });

  it('formata em BRL', () => {
    expect(Money.fromCents(6990).toBRL()).toContain('69,90');
  });
});
