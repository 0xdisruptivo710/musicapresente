import type { TributePage } from '@/core/domain/entities/tribute-page';

export interface TributePageRepository {
  /** Busca pública por slug (a página VIP não conhece o tenant). */
  findBySlug(slug: string): Promise<TributePage | null>;
}
