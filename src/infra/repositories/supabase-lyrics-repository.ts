import type { Lyrics } from '@/core/domain/entities/lyrics';
import type { LyricsRepository } from '@/core/ports/repositories/lyrics-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { LyricsMapper } from '@/infra/db/mappers/lyrics-mapper';

/** Implementação do LyricsRepository sobre o Supabase (schema `cancao`). */
export class SupabaseLyricsRepository implements LyricsRepository {
  constructor(private readonly db: CancaoClient) {}

  async save(lyrics: Lyrics): Promise<void> {
    const { error } = await this.db.from('lyrics').insert(LyricsMapper.toInsert(lyrics));
    if (error) {
      throw new Error(`SupabaseLyricsRepository.save: ${error.message}`);
    }
  }

  async findLatestByOrderId(tenantId: string, orderId: string): Promise<Lyrics | null> {
    const { data, error } = await this.db
      .from('lyrics')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseLyricsRepository.findLatestByOrderId: ${error.message}`);
    }
    return data ? LyricsMapper.toDomain(data) : null;
  }
}
