import type { Song } from '@/core/domain/entities/song';
import type { SongVersion } from '@/core/domain/value-objects/song-version';

/** Forma da música exposta pela API (prévia). */
export interface SongDTO {
  id: string;
  version: SongVersion;
  audioUrl: string | null;
  title: string | null;
  durationSeconds: number | null;
  imageUrl: string | null;
  locked: boolean;
}

export function toSongDTO(song: Song): SongDTO {
  const p = song.toPrimitives();
  return {
    id: p.id,
    version: p.version,
    // Enquanto o pipeline de áudio (Passo 6) não roda, servimos a URL da Suno.
    audioUrl: p.previewUrl ?? p.sunoAudioUrl,
    title: p.title,
    durationSeconds: p.durationSeconds,
    imageUrl: p.imageUrl,
    locked: p.locked,
  };
}
