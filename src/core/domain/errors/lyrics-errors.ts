import { DomainError } from './domain-error';

/** Estado do pedido não permite gerar/ajustar letra agora. */
export class CannotGenerateLyricsError extends DomainError {
  readonly code = 'CANNOT_GENERATE_LYRICS';
  override readonly httpStatus = 409;
}

/** Falha ao gerar a letra no provedor de LLM (ex.: OpenAI fora do ar). */
export class LyricsGenerationError extends DomainError {
  readonly code = 'LYRICS_GENERATION_FAILED';
  override readonly httpStatus = 502;
}
