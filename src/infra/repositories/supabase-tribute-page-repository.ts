import type { TributePage } from '@/core/domain/entities/tribute-page';
import type { TributePageRepository } from '@/core/ports/repositories/tribute-page-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { TributePageMapper } from '@/infra/db/mappers/tribute-page-mapper';

/** Implementação do TributePageRepository sobre o Supabase (schema `cancao`). */
export class SupabaseTributePageRepository implements TributePageRepository {
  constructor(private readonly db: CancaoClient) {}

  async findBySlug(slug: string): Promise<TributePage | null> {
    const { data, error } = await this.db
      .from('tribute_pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseTributePageRepository.findBySlug: ${error.message}`);
    }
    return data ? TributePageMapper.toDomain(data) : null;
  }

  async create(page: TributePage): Promise<void> {
    const { error } = await this.db
      .from('tribute_pages')
      .insert(TributePageMapper.toInsert(page));
    if (error) {
      throw new Error(`SupabaseTributePageRepository.create: ${error.message}`);
    }
  }
}
