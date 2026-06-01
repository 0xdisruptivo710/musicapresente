import type { Song } from '@/core/domain/entities/song';
import type { SongRepository } from '@/core/ports/repositories/song-repository';

/** Lista as músicas (V1/V2) de um pedido. */
export class GetSongsUseCase {
  constructor(private readonly songs: SongRepository) {}

  execute(input: { tenantId: string; orderId: string }): Promise<Song[]> {
    return this.songs.findByOrderId(input.tenantId, input.orderId);
  }
}
