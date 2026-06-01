import type { VoiceGender } from '@/core/domain/value-objects/voice-gender';

export interface GenerateMusicParams {
  /** Letra cantada (custom mode). */
  lyrics: string;
  /** Estilo/gêneros combinados. */
  style: string;
  title: string;
  vocalGender: VoiceGender | null;
}

export interface MusicTrack {
  audioId: string;
  audioUrl: string;
  imageUrl: string | null;
  title: string | null;
  durationSeconds: number | null;
  tags: string[];
}

export type MusicStatus = 'pending' | 'generating' | 'success' | 'failed';

export interface MusicStatusResult {
  status: MusicStatus;
  tracks: MusicTrack[];
}

/**
 * Geração de música via provedor assíncrono (CLAUDE.md §7.1). Implementação
 * atual: Suno. `generate` dispara e devolve um taskId; o resultado chega por
 * callback (webhook) ou pode ser consultado por `getStatus` (fallback/polling).
 */
export interface MusicGateway {
  generate(params: GenerateMusicParams): Promise<{ taskId: string }>;
  getStatus(taskId: string): Promise<MusicStatusResult>;
}
