import { TributePage } from '@/core/domain/entities/tribute-page';
import type { Database, Json } from '@/infra/db/database.types';
import { toStringArray } from '@/infra/db/json';

type TributePageRow = Database['cancao']['Tables']['tribute_pages']['Row'];
type TributePageInsert = Database['cancao']['Tables']['tribute_pages']['Insert'];

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

  toInsert(page: TributePage): TributePageInsert {
    const p = page.toPrimitives();
    return {
      id: p.id,
      tenant_id: p.tenantId,
      order_id: p.orderId,
      song_id: p.songId,
      slug: p.slug,
      title: p.title,
      honoree_name: p.honoreeName,
      message: p.message,
      signature: p.signature,
      photos: p.photos as unknown as Json,
      published: p.published,
      published_at: p.publishedAt ? p.publishedAt.toISOString() : null,
    };
  },
};
