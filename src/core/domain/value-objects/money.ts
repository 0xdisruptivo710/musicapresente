import { InvalidMoneyError } from '@/core/domain/errors/value-object-errors';

/**
 * Valor monetário em CENTAVOS (inteiro) — CLAUDE.md §5.1. Nunca usar float.
 */
export class Money {
  private constructor(public readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      throw new InvalidMoneyError(`Valor monetário deve ser inteiro em centavos: ${cents}`);
    }
    if (cents < 0) {
      throw new InvalidMoneyError(`Valor monetário não pode ser negativo: ${cents}`);
    }
    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return Money.fromCents(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return Money.fromCents(this.cents - other.cents);
  }

  multiply(factor: number): Money {
    return Money.fromCents(Math.round(this.cents * factor));
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  /** Formata em BRL (ex.: 6990 → "R$ 69,90"). */
  toBRL(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.cents / 100);
  }
}
