import type { Json } from './database.types';

/** Converte um campo jsonb em array de strings (descarta itens não-string). */
export function toStringArray(value: Json | null): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

/** Converte um campo jsonb em objeto plano; `{}` se não for objeto. */
export function toRecord(value: Json | null): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
