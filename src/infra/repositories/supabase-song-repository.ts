import type { Song } from '@/core/domain/entities/song';
import type { SongRepository } from '@/core/ports/repositories/song-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { SongMapper } from '@/infra/db/mappers/song-mapper';

/** Implementação do SongRepository sobre o Supabase (schema `cancao`). */
export class SupabaseSongRepository implements SongRepository {
  constructor(private readonly db: CancaoClient) {}

  async saveMany(songs: Song[]): Promise<void> {
    if (songs.length === 0) return;
    const { error } = await this.db.from('songs').insert(songs.map((s) => SongMapper.toInsert(s)));
    if (error) {
      throw new Error(`SupabaseSongRepository.saveMany: ${error.message}`);
    }
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<Song[]> {
    const { data, error } = await this.db
      .from('songs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .order('version', { ascending: true });
    if (error) {
      throw new Error(`SupabaseSongRepository.findByOrderId: ${error.message}`);
    }
    return (data ?? []).map((row) => SongMapper.toDomain(row));
  }
}
