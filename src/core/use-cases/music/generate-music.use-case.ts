import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { LyricsRepository } from '@/core/ports/repositories/lyrics-repository';
import type { QuizAnswersRepository } from '@/core/ports/repositories/quiz-answers-repository';
import type { MusicGateway } from '@/core/ports/gateways/music-gateway';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import { CannotGenerateMusicError } from '@/core/domain/errors/music-errors';

export interface GenerateMusicInput {
  tenantId: string;
  orderId: string;
}

export interface GenerateMusicOutput {
  taskId: string;
}

/**
 * Dispara a geração da música na Suno (assíncrona). Exige o pedido em
 * LYRICS_READY; transiciona para MUSIC_GENERATING e guarda o taskId. O resultado
 * chega depois pelo webhook (HandleSunoCallbackUseCase). CLAUDE.md §5.3, §8.
 */
export class GenerateMusicUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly lyrics: LyricsRepository,
    private readonly quizAnswers: QuizAnswersRepository,
    private readonly gateway: MusicGateway,
  ) {}

  async execute(input: GenerateMusicInput): Promise<GenerateMusicOutput> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }
    if (order.status !== 'lyrics_ready') {
      throw new CannotGenerateMusicError(
        `Não é possível gerar música com o pedido em "${order.status}".`,
      );
    }

    const lyrics = await this.lyrics.findLatestByOrderId(input.tenantId, input.orderId);
    if (!lyrics) {
      throw new CannotGenerateMusicError('Gere a letra antes de criar a música.');
    }

    const answers = (await this.quizAnswers.findByOrderId(input.tenantId, input.orderId))?.toPrimitives();
    const style = (answers?.genres ?? []).join(', ') || 'Pop';
    const title = lyrics.title ?? `Música para ${answers?.honoreeName ?? 'você'}`;

    const { taskId } = await this.gateway.generate({
      lyrics: lyrics.content,
      style,
      title,
      vocalGender: answers?.voiceGender ?? null,
    });

    order.startMusic(taskId);
    await this.orders.update(order);
    return { taskId };
  }
}
