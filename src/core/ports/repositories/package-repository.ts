import type { Package } from '@/core/domain/entities/package';

export interface PackageRepository {
  /** Pacotes ativos do tenant, ordenados por `sort_order`. */
  listActive(tenantId: string): Promise<Package[]>;
  findById(tenantId: string, id: string): Promise<Package | null>;
  findByCode(tenantId: string, code: string): Promise<Package | null>;
}
