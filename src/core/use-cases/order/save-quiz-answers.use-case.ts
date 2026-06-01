import { QuizAnswers } from '@/core/domain/entities/quiz-answers';
import type { VoiceGender } from '@/core/domain/value-objects/voice-gender';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { QuizAnswersRepository } from '@/core/ports/repositories/quiz-answers-repository';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';

export interface SaveQuizAnswersInput {
  tenantId: string;
  orderId: string;
  answers: {
    occasionCategory?: string | null;
    occasionMoment?: string | null;
    genres?: string[];
    honoreeName?: string | null;
    story?: string | null;
    voiceGender?: VoiceGender | null;
  };
}

/**
 * Salva (upsert) as respostas do quiz e, na primeira vez, transiciona o pedido
 * DRAFT → QUIZ_COMPLETED. Re-salvar (edição) não falha. CLAUDE.md §5.3, §6.
 */
export class SaveQuizAnswersUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly quizAnswers: QuizAnswersRepository,
  ) {}

  async execute(input: SaveQuizAnswersInput): Promise<void> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }

    const answers = QuizAnswers.create({
      tenantId: input.tenantId,
      orderId: input.orderId,
      ...input.answers,
    });
    await this.quizAnswers.upsert(answers);

    if (order.status === 'draft') {
      order.completeQuiz();
      await this.orders.update(order);
    }
  }
}
