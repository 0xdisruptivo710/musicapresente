import type { TributePage } from '@/core/domain/entities/tribute-page';

/** Forma pública da Página VIP (sem ids internos/tenant). */
export interface TributePageDTO {
  slug: string;
  title: string | null;
  honoreeName: string | null;
  message: string | null;
  signature: string | null;
  photos: string[];
  audioUrl: string | null;
}

export function toTributePageDTO(page: TributePage, audioUrl: string | null): TributePageDTO {
  const p = page.toPrimitives();
  return {
    slug: p.slug,
    title: p.title,
    honoreeName: p.honoreeName,
    message: p.message,
    signature: p.signature,
    photos: p.photos,
    audioUrl,
  };
}
