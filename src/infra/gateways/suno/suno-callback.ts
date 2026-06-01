import type { MusicTrack } from '@/core/ports/gateways/music-gateway';
import { normalizeTracks } from './suno-normalize';

export interface ParsedSunoCallback {
  taskId: string | null;
  succeeded: boolean;
  callbackType: string | null;
  tracks: MusicTrack[];
}

/**
 * Normaliza o payload do webhook da Suno. Estágios: `text` → `first` →
 * `complete` (tratamos `complete` como música pronta). CLAUDE.md §7.1.
 */
export function parseSunoCallback(raw: unknown): ParsedSunoCallback {
  const payload = (raw ?? {}) as {
    code?: unknown;
    data?: { task_id?: unknown; taskId?: unknown; callbackType?: unknown; data?: unknown };
  };
  const d = payload.data ?? {};
  const taskId =
    typeof d.task_id === 'string' ? d.task_id : typeof d.taskId === 'string' ? d.taskId : null;

  return {
    taskId,
    succeeded: payload.code === 200,
    callbackType: typeof d.callbackType === 'string' ? d.callbackType : null,
    tracks: normalizeTracks(d.data),
  };
}
