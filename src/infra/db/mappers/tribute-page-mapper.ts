import { TributePage } from '@/core/domain/entities/tribute-page';
import type { Database } from '@/infra/db/database.types';
import { toStringArray } from '@/infra/db/json';

type TributePageRow = Database['cancao']['Tables']['tribute_pages']['Row'];

/** Converte a linha de `cancao.tribute_pages` na entidade TributePage. */
export const TributePageMapper = {
  toDomain(row: TributePageRow): TributePage {
    return TributePage.restore({
      id: row.id,
      tenantId: row.tenant_id,
      orderId: row.order_id,
      songId: row.song_id,
      slug: row.slug,
      title: row.title,
      honoreeName: row.honoree_name,
      message: row.message,
      signature: row.signature,
      photos: toStringArray(row.photos),
      published: row.published,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  },
};
