import type { Lyrics } from '@/core/domain/entities/lyrics';

/** Forma da letra exposta pela API. */
export interface LyricsDTO {
  id: string;
  version: number;
  title: string | null;
  content: string;
  tone: string | null;
}

export function toLyricsDTO(lyrics: Lyrics): LyricsDTO {
  const p = lyrics.toPrimitives();
  return {
    id: p.id,
    version: p.version,
    title: p.title,
    content: p.content,
    tone: p.tone,
  };
}
