import { Lyrics } from '@/core/domain/entities/lyrics';
import type { Database } from '@/infra/db/database.types';

type LyricsRow = Database['cancao']['Tables']['lyrics']['Row'];
type LyricsInsert = Database['cancao']['Tables']['lyrics']['Insert'];

/** Converte entre a linha do banco (`cancao.lyrics`) e a entidade Lyrics. */
export const LyricsMapper = {
  toDomain(row: LyricsRow): Lyrics {
    return Lyrics.restore({
      id: row.id,
      tenantId: row.tenant_id,
      orderId: row.order_id,
      version: row.version,
      title: row.title,
      content: row.content,
      tone: row.tone,
      model: row.model,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  },

  toInsert(lyrics: Lyrics): LyricsInsert {
    const p = lyrics.toPrimitives();
    return {
      id: p.id,
      tenant_id: p.tenantId,
      order_id: p.orderId,
      version: p.version,
      title: p.title,
      content: p.content,
      tone: p.tone,
      model: p.model,
    };
  },
};
