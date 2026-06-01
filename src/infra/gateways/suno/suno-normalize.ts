import type { MusicStatus, MusicTrack } from '@/core/ports/gateways/music-gateway';

/** Normaliza o status textual da Suno (GENERATING/SUCCESS/FAILED/PENDING). */
export function normalizeStatus(raw: unknown): MusicStatus {
  const value = String(raw ?? '').toUpperCase();
  if (value === 'SUCCESS') return 'success';
  if (value === 'FAILED') return 'failed';
  if (value === 'GENERATING') return 'generating';
  return 'pending';
}

/** Tags vêm como array OU string "folk, acoustic"; normaliza para string[]. */
export function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === 'string');
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

interface RawTrack {
  id?: unknown;
  audio_url?: unknown;
  image_url?: unknown;
  title?: unknown;
  duration?: unknown;
  tags?: unknown;
}

/** Normaliza a lista de faixas da Suno (descarta as sem audio_url). */
export function normalizeTracks(raw: unknown): MusicTrack[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): MusicTrack | null => {
      const t = item as RawTrack;
      const audioUrl = typeof t.audio_url === 'string' ? t.audio_url : '';
      if (!audioUrl) return null;
      return {
        audioId: typeof t.id === 'string' ? t.id : '',
        audioUrl,
        imageUrl: typeof t.image_url === 'string' ? t.image_url : null,
        title: typeof t.title === 'string' ? t.title : null,
        durationSeconds: typeof t.duration === 'number' ? t.duration : null,
        tags: normalizeTags(t.tags),
      };
    })
    .filter((t): t is MusicTrack => t !== null);
}
