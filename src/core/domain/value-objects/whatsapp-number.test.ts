import { describe, it, expect } from 'vitest';
import { WhatsAppNumber } from './whatsapp-number';
import { InvalidWhatsAppNumberError } from '@/core/domain/errors/value-object-errors';

describe('WhatsAppNumber', () => {
  it('normaliza número com máscara para E.164 sem +', () => {
    expect(WhatsAppNumber.create('(31) 99999-8888').value).toBe('5531999998888');
  });

  it('aceita entrada com código do país', () => {
    expect(WhatsAppNumber.create('+55 31 99999-8888').value).toBe('5531999998888');
  });

  it('aceita telefone fixo (10 dígitos)', () => {
    expect(WhatsAppNumber.create('31 3333-4444').value).toBe('553133334444');
  });

  it('rejeita número curto demais', () => {
    expect(() => WhatsAppNumber.create('99999')).toThrow(InvalidWhatsAppNumberError);
  });

  it('rejeita DDD inválido', () => {
    expect(() => WhatsAppNumber.create('0099999-8888')).toThrow(InvalidWhatsAppNumberError);
  });

  it('formata para exibição', () => {
    expect(WhatsAppNumber.create('5531999998888').toDisplay()).toBe('(31) 99999-8888');
  });
});
