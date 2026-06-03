import type { TributePage } from '@/core/domain/entities/tribute-page';
import type { TributePageRepository } from '@/core/ports/repositories/tribute-page-repository';
import type { SongRepository } from '@/core/ports/repositories/song-repository';

export interface TributePageResult {
  page: TributePage;
  audioUrl: string | null;
}

/** Busca a Página VIP publicada por slug e a URL da música do pedido. */
export class GetTributePageBySlugUseCase {
  constructor(
    private readonly pages: TributePageRepository,
    private readonly songs: SongRepository,
  ) {}

  async execute(input: { slug: string }): Promise<TributePageResult | null> {
    const page = await this.pages.findBySlug(input.slug);
    if (!page) return null;

    const songs = await this.songs.findByOrderId(page.tenantId, page.orderId);
    const first = songs[0]?.toPrimitives();
    const audioUrl = first ? (first.previewUrl ?? first.sunoAudioUrl) : null;

    return { page, audioUrl };
  }
}
