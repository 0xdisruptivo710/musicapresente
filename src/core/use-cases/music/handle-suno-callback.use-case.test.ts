import { describe, it, expect, beforeEach } from 'vitest';
import { HandleSunoCallbackUseCase } from './handle-suno-callback.use-case';
import { Order } from '@/core/domain/entities/order';
import { InMemoryOrderRepository } from '@/test-support/in-memory-repositories';
import { InMemorySongRepository } from '@/test-support/music-doubles';
import type { MusicTrack } from '@/core/ports/gateways/music-gateway';

const TENANT = '11111111-1111-4111-8111-111111111111';
const TASK = 'task-123';

function track(id: string): MusicTrack {
  return {
    audioId: id,
    audioUrl: `https://cdn.suno/${id}.mp3`,
    imageUrl: null,
    title: 'Faixa',
    durationSeconds: 130,
    tags: ['pop'],
  };
}

describe('HandleSunoCallbackUseCase', () => {
  let orders: InMemoryOrderRepository;
  let songs: InMemorySongRepository;
  let useCase: HandleSunoCallbackUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    songs = new InMemorySongRepository();
    useCase = new HandleSunoCallbackUseCase(orders, songs);
  });

  async function seedMusicGenerating(): Promise<string> {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    order.startLyrics();
    order.markLyricsReady();
    order.startMusic(TASK);
    await orders.create(order);
    return order.id;
  }

  it('cria V1/V2 e move o pedido para preview_ready', async () => {
    const orderId = await seedMusicGenerating();
    await useCase.execute({ taskId: TASK, succeeded: true, tracks: [track('a1'), track('a2')] });

    expect(songs.saved).toHaveLength(2);
    expect(songs.saved.map((s) => s.version).sort()).toEqual(['v1', 'v2']);
    expect((await orders.findById(TENANT, orderId))?.status).toBe('preview_ready');
  });

  it('é idempotente: callback duplicado não cria músicas a mais', async () => {
    await seedMusicGenerating();
    const payload = { taskId: TASK, succeeded: true, tracks: [track('a1'), track('a2')] };
    await useCase.execute(payload);
    await useCase.execute(payload);
    expect(songs.saved).toHaveLength(2);
  });

  it('ignora taskId desconhecido', async () => {
    await seedMusicGenerating();
    await useCase.execute({ taskId: 'outro-task', succeeded: true, tracks: [track('x')] });
    expect(songs.saved).toHaveLength(0);
  });

  it('marca o pedido como failed quando a geração falha', async () => {
    const orderId = await seedMusicGenerating();
    await useCase.execute({ taskId: TASK, succeeded: false, tracks: [] });
    expect(songs.saved).toHaveLength(0);
    expect((await orders.findById(TENANT, orderId))?.status).toBe('failed');
  });
});
