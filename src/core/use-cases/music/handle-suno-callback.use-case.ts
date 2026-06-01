import { Song } from '@/core/domain/entities/song';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { SongRepository } from '@/core/ports/repositories/song-repository';
import type { MusicTrack } from '@/core/ports/gateways/music-gateway';
import type { SongVersion } from '@/core/domain/value-objects/song-version';

export interface HandleSunoCallbackInput {
  taskId: string;
  succeeded: boolean;
  tracks: MusicTrack[];
}

const VERSIONS: SongVersion[] = ['v1', 'v2'];

/**
 * Processa o retorno da Suno (webhook ou polling): cria as Songs V1/V2 e
 * transiciona o pedido MUSIC_GENERATING → PREVIEW_READY. Idempotente: só age
 * quando o pedido ainda está gerando música (callbacks duplicados são ignorados).
 * CLAUDE.md §8, §9.
 */
export class HandleSunoCallbackUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly songs: SongRepository,
  ) {}

  async execute(input: HandleSunoCallbackInput): Promise<void> {
    const order = await this.orders.findBySunoTaskId(input.taskId);
    if (!order) return; // taskId desconhecido — ignora
    if (order.status !== 'music_generating') return; // já processado (idempotência)

    if (!input.succeeded || input.tracks.length === 0) {
      order.fail('Falha na geração da música (Suno).');
      await this.orders.update(order);
      return;
    }

    const songs = input.tracks.slice(0, 2).map((track, index) =>
      Song.create({
        tenantId: order.tenantId,
        orderId: order.id,
        version: VERSIONS[index] ?? 'v1',
        sunoTaskId: input.taskId,
        sunoAudioId: track.audioId,
        sunoAudioUrl: track.audioUrl,
        title: track.title,
        durationSeconds: track.durationSeconds,
        imageUrl: track.imageUrl,
        tags: track.tags,
      }),
    );
    await this.songs.saveMany(songs);

    order.markPreviewReady();
    await this.orders.update(order);
  }
}
