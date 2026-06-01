import { DomainError } from './domain-error';

/** Falha ao transcrever o áudio no provedor (ex.: OpenAI fora do ar). */
export class TranscriptionError extends DomainError {
  readonly code = 'TRANSCRIPTION_FAILED';
  override readonly httpStatus = 502;
}
