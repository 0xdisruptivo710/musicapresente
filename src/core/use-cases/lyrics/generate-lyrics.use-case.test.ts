import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateLyricsUseCase } from './generate-lyrics.use-case';
import { Order } from '@/core/domain/entities/order';
import { QuizAnswers } from '@/core/domain/entities/quiz-answers';
import { CannotGenerateLyricsError } from '@/core/domain/errors/lyrics-errors';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import {
  InMemoryOrderRepository,
  InMemoryQuizAnswersRepository,
} from '@/test-support/in-memory-repositories';
import { FakeLyricsGateway, InMemoryLyricsRepository } from '@/test-support/lyrics-doubles';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('GenerateLyricsUseCase', () => {
  let orders: InMemoryOrderRepository;
  let quiz: InMemoryQuizAnswersRepository;
  let lyrics: InMemoryLyricsRepository;
  let gateway: FakeLyricsGateway;
  let useCase: GenerateLyricsUseCase;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    quiz = new InMemoryQuizAnswersRepository();
    lyrics = new InMemoryLyricsRepository();
    gateway = new FakeLyricsGateway();
    useCase = new GenerateLyricsUseCase(orders, quiz, lyrics, gateway);
  });

  async function seedQuizCompleted(): Promise<string> {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    await orders.create(order);
    await quiz.upsert(
      QuizAnswers.create({
        tenantId: TENANT,
        orderId: order.id,
        honoreeName: 'Ana',
        story: 'A gente se conheceu no trabalho.',
        genres: ['Pop', 'Sertanejo'],
        voiceGender: 'f',
      }),
    );
    return order.id;
  }

  it('gera a letra v1 e move o pedido para lyrics_ready', async () => {
    const orderId = await seedQuizCompleted();
    const result = await useCase.execute({ tenantId: TENANT, orderId });
    expect(result.version).toBe(1);
    expect(result.content).toContain('Ana');
    expect((await orders.findById(TENANT, orderId))?.status).toBe('lyrics_ready');
  });

  it('ajusta gerando v2 com a instrução, mantendo lyrics_ready', async () => {
    const orderId = await seedQuizCompleted();
    await useCase.execute({ tenantId: TENANT, orderId });
    const v2 = await useCase.execute({ tenantId: TENANT, orderId, instruction: 'deixe mais alegre' });
    expect(v2.version).toBe(2);
    expect(v2.content).toContain('deixe mais alegre');
    expect((await orders.findById(TENANT, orderId))?.status).toBe('lyrics_ready');
    // o gateway recebeu a letra anterior como base do ajuste
    expect(gateway.calls[1]?.previousContent).toBeTruthy();
  });

  it('recusa gerar quando o pedido ainda está em draft', async () => {
    const order = Order.create({ tenantId: TENANT });
    await orders.create(order);
    await expect(
      useCase.execute({ tenantId: TENANT, orderId: order.id }),
    ).rejects.toBeInstanceOf(CannotGenerateLyricsError);
  });

  it('recusa quando não há respostas de quiz', async () => {
    const order = Order.create({ tenantId: TENANT });
    order.completeQuiz();
    await orders.create(order);
    await expect(
      useCase.execute({ tenantId: TENANT, orderId: order.id }),
    ).rejects.toBeInstanceOf(CannotGenerateLyricsError);
  });

  it('lança quando o pedido não existe', async () => {
    await expect(
      useCase.execute({ tenantId: TENANT, orderId: 'inexistente' }),
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  });
});
