import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateMusicUseCase } from './generate-music.use-case';
import { Order } from '@/core/domain/entities/order';
import { Lyrics } from '@/core/domain/entities/lyrics';
import { QuizAnswers } from '@/core/domain/entities/quiz-answers';
import { CannotGenerateMusicError } from '@/core/domain/errors/music-errors';
import {
  InMemoryOrderRepository,
  InMemoryQuizAnswersRepository,
} from '@/test-support/in-memory-repositories';
import { InMemoryLyricsRepository } from '@/test-support/lyrics-doubles';
import { FakeMusicGateway } from '@/test-support/music-doubles';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('GenerateMusicUseCase', () => {
  let orders: InMemoryOrderRepository;
  let lyrics: InMemoryLyricsRepository;
  let quiz: InMemoryQuizAnswersRepository;
  let gateway: FakeMusicGateway;
  let useCase: GenerateMusicUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    lyrics = new InMemoryLyricsRepository();
    quiz = new InMemoryQuizAnswersRepository();
    gateway = new FakeMusicGateway();
    useCase = new GenerateMusicUseCase(orders, lyrics, quiz, gateway);
  });

  async function seedLyricsReady(withLyrics = true): Promise<string> {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    order.startLyrics();
    order.markLyricsReady();
    await orders.create(order);
    await quiz.upsert(
      QuizAnswers.create({
        tenantId: TENANT,
        orderId: order.id,
        genres: ['Pop', 'Rap'],
        honoreeName: 'Ana',
        voiceGender: 'f',
      }),
    );
    if (withLyrics) {
      await lyrics.save(
        Lyrics.create({ tenantId: TENANT, orderId: order.id, version: 1, content: '[Verso] Ana...', title: 'Para Ana' }),
      );
    }
    return order.id;
  }

  it('dispara a Suno e move o pedido para music_generating com o taskId', async () => {
    const orderId = await seedLyricsReady();
    const { taskId } = await useCase.execute({ tenantId: TENANT, orderId });

    expect(taskId).toBe('task-fake-1');
    const order = await orders.findById(TENANT, orderId);
    expect(order?.status).toBe('music_generating');
    expect(order?.sunoTaskId).toBe('task-fake-1');
    expect(gateway.generateCalls[0]?.style).toBe('Pop, Rap');
    expect(gateway.generateCalls[0]?.vocalGender).toBe('f');
  });

  it('recusa quando o pedido não está em lyrics_ready', async () => {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    await orders.create(order);
    await expect(
      useCase.execute({ tenantId: TENANT, orderId: order.id }),
    ).rejects.toBeInstanceOf(CannotGenerateMusicError);
  });

  it('recusa quando não há letra gerada', async () => {
    const orderId = await seedLyricsReady(false);
    await expect(
      useCase.execute({ tenantId: TENANT, orderId }),
    ).rejects.toBeInstanceOf(CannotGenerateMusicError);
  });
});
