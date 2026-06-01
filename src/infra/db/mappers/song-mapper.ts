import { Song } from '@/core/domain/entities/song';
import type { Database } from '@/infra/db/database.types';

type SongRow = Database['cancao']['Tables']['songs']['Row'];
type SongInsert = Database['cancao']['Tables']['songs']['Insert'];

/** Converte entre a linha do banco (`cancao.songs`) e a entidade Song. */
export const SongMapper = {
  toDomain(row: SongRow): Song {
    return Song.restore({
      id: row.id,
      tenantId: row.tenant_id,
      orderId: row.order_id,
      version: row.version,
      sunoTaskId: row.suno_task_id,
      sunoAudioId: row.suno_audio_id,
      sunoAudioUrl: row.suno_audio_url,
      title: row.title,
      style: row.style,
      durationSeconds: row.duration_seconds,
      previewUrl: row.preview_url,
      fullPath: row.full_path,
      imageUrl: row.image_url,
      tags: row.tags,
      locked: row.locked,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  },

  toInsert(song: Song): SongInsert {
    const p = song.toPrimitives();
    return {
      id: p.id,
      tenant_id: p.tenantId,
      order_id: p.orderId,
      version: p.version,
      suno_task_id: p.sunoTaskId,
      suno_audio_id: p.sunoAudioId,
      suno_audio_url: p.sunoAudioUrl,
      title: p.title,
      style: p.style,
      duration_seconds: p.durationSeconds,
      preview_url: p.previewUrl,
      full_path: p.fullPath,
      image_url: p.imageUrl,
      tags: p.tags,
      locked: p.locked,
    };
  },
};
