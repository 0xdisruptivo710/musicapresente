import type { Lyrics } from '@/core/domain/entities/lyrics';

/** Persistência das letras (versionadas por pedido). */
export interface LyricsRepository {
  save(lyrics: Lyrics): Promise<void>;
  /** Última versão (maior `version`) de um pedido, ou null. */
  findLatestByOrderId(tenantId: string, orderId: string): Promise<Lyrics | null>;
}
