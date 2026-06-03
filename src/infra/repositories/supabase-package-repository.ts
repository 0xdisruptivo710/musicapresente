import type { Package } from '@/core/domain/entities/package';
import type { PackageRepository } from '@/core/ports/repositories/package-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { PackageMapper } from '@/infra/db/mappers/package-mapper';

/** Implementação do PackageRepository sobre o Supabase (schema `cancao`). */
export class SupabasePackageRepository implements PackageRepository {
  constructor(private readonly db: CancaoClient) {}

  async listActive(tenantId: string): Promise<Package[]> {
    const { data, error } = await this.db
      .from('packages')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) {
      throw new Error(`SupabasePackageRepository.listActive: ${error.message}`);
    }
    return (data ?? []).map(PackageMapper.toDomain);
  }

  async findById(tenantId: string, id: string): Promise<Package | null> {
    const { data, error } = await this.db
      .from('packages')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabasePackageRepository.findById: ${error.message}`);
    }
    return data ? PackageMapper.toDomain(data) : null;
  }

  async findByCode(tenantId: string, code: string): Promise<Package | null> {
    const { data, error } = await this.db
      .from('packages')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('code', code)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabasePackageRepository.findByCode: ${error.message}`);
    }
    return data ? PackageMapper.toDomain(data) : null;
  }
}
