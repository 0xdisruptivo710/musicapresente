import type { Song } from '@/core/domain/entities/song';

/** Persistência das músicas (V1/V2 por pedido). */
export interface SongRepository {
  saveMany(songs: Song[]): Promise<void>;
  findByOrderId(tenantId: string, orderId: string): Promise<Song[]>;
  /** Libera as músicas do pedido após o pagamento (locked = false). */
  unlockByOrderId(tenantId: string, orderId: string): Promise<void>;
}
