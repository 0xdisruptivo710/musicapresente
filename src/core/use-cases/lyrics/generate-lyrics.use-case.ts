import { Lyrics } from '@/core/domain/entities/lyrics';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { QuizAnswersRepository } from '@/core/ports/repositories/quiz-answers-repository';
import type { LyricsRepository } from '@/core/ports/repositories/lyrics-repository';
import type { LyricsGateway } from '@/core/ports/gateways/lyrics-gateway';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import { CannotGenerateLyricsError } from '@/core/domain/errors/lyrics-errors';

export interface GenerateLyricsInput {
  tenantId: string;
  orderId: string;
  /** Quando presente, ajusta a partir da letra anterior (revisão). */
  instruction?: string | null;
}

/**
 * Gera (1ª vez) ou ajusta/regenera a letra de um pedido via LLM. CLAUDE.md §5.3.
 *
 * Síncrono: o LLM responde em segundos. Na 1ª geração o pedido avança
 * QUIZ_COMPLETED → LYRICS_READY (passando por LYRICS_GENERATING em memória, sem
 * persistir o estado intermediário). Falha do gateway NÃO altera o pedido:
 * o usuário pode tentar de novo.
 */
export class GenerateLyricsUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly quizAnswers: QuizAnswersRepository,
    private readonly lyrics: LyricsRepository,
    private readonly gateway: LyricsGateway,
  ) {}

  async execute(input: GenerateLyricsInput): Promise<Lyrics> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }

    const isFirst = order.status === 'quiz_completed';
    const isRegen = order.status === 'lyrics_ready';
    if (!isFirst && !isRegen) {
      throw new CannotGenerateLyricsError(
        `Não é possível gerar letra com o pedido em "${order.status}".`,
      );
    }

    const answers = await this.quizAnswers.findByOrderId(input.tenantId, input.orderId);
    if (!answers) {
      throw new CannotGenerateLyricsError('Responda o quiz antes de gerar a letra.');
    }
    const a = answers.toPrimitives();

    const previous = await this.lyrics.findLatestByOrderId(input.tenantId, input.orderId);

    const generated = await this.gateway.generate({
      occasionCategory: a.occasionCategory,
      occasionMoment: a.occasionMoment,
      genres: a.genres,
      honoreeName: a.honoreeName,
      story: a.story,
      voiceGender: a.voiceGender,
      previousContent: previous?.content ?? null,
      instruction: input.instruction ?? null,
    });

    const nextVersion = (previous?.version ?? 0) + 1;
    const lyrics = Lyrics.create({
      tenantId: input.tenantId,
      orderId: input.orderId,
      version: nextVersion,
      title: generated.title,
      content: generated.content,
      tone: generated.tone,
      model: generated.model,
    });
    await this.lyrics.save(lyrics);

    if (isFirst) {
      order.startLyrics();
      order.markLyricsReady();
      await this.orders.update(order);
    }

    return lyrics;
  }
}
