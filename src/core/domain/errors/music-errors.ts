import { DomainError } from './domain-error';

/** Estado do pedido não permite gerar música agora (precisa de letra pronta). */
export class CannotGenerateMusicError extends DomainError {
  readonly code = 'CANNOT_GENERATE_MUSIC';
  override readonly httpStatus = 409;
}

/** Falha ao gerar a música no provedor (ex.: Suno fora do ar). */
export class MusicGenerationError extends DomainError {
  readonly code = 'MUSIC_GENERATION_FAILED';
  override readonly httpStatus = 502;
}
