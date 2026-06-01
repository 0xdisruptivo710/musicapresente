import type { VoiceGender } from '@/core/domain/value-objects/voice-gender';

export interface LyricsGenerationParams {
  occasionCategory: string | null;
  occasionMoment: string | null;
  genres: string[];
  honoreeName: string | null;
  story: string | null;
  voiceGender: VoiceGender | null;
  /** Letra anterior, quando estamos ajustando/regenerando. */
  previousContent?: string | null;
  /** Instrução de ajuste do usuário (ex.: "deixe mais alegre"). */
  instruction?: string | null;
}

export interface GeneratedLyrics {
  title: string | null;
  content: string;
  tone: string | null;
  model: string;
}

/**
 * Geração de letra via LLM (CLAUDE.md §7.1). Implementação atual: OpenAI.
 * Encapsulado por interface para trocar de provedor sem tocar no core.
 */
export interface LyricsGateway {
  generate(params: LyricsGenerationParams): Promise<GeneratedLyrics>;
}
