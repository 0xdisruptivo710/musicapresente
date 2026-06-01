import { InvalidWhatsAppNumberError } from '@/core/domain/errors/value-object-errors';

/**
 * Número de WhatsApp brasileiro, normalizado para E.164 sem '+' (ex.: 5531999998888).
 * Aceita entrada com máscara, com ou sem código do país.
 */
export class WhatsAppNumber {
  private constructor(public readonly value: string) {}

  static create(raw: string): WhatsAppNumber {
    const digits = (raw ?? '').replace(/\D/g, '');

    // Remove o código do país (55) só quando claramente presente (>= 12 dígitos),
    // para não confundir com o DDD 55 (Santa Maria/RS) de um número nacional.
    let national = digits;
    if (national.startsWith('55') && national.length >= 12) {
      national = national.slice(2);
    }

    // Nacional válido: 10 dígitos (fixo) ou 11 (celular com 9).
    if (national.length !== 10 && national.length !== 11) {
      throw new InvalidWhatsAppNumberError(`Número de WhatsApp inválido: ${raw}`);
    }

    const ddd = Number(national.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      throw new InvalidWhatsAppNumberError(`DDD inválido em: ${raw}`);
    }

    return new WhatsAppNumber(`55${national}`);
  }

  /** Formato amigável: (31) 99999-8888 ou (31) 3333-4444. */
  toDisplay(): string {
    const national = this.value.slice(2);
    const ddd = national.slice(0, 2);
    const rest = national.slice(2);
    const prefix = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4);
    const suffix = rest.length === 9 ? rest.slice(5) : rest.slice(4);
    return `(${ddd}) ${prefix}-${suffix}`;
  }

  equals(other: WhatsAppNumber): boolean {
    return this.value === other.value;
  }
}
