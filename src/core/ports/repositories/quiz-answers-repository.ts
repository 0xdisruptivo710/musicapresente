import type { QuizAnswers } from '@/core/domain/entities/quiz-answers';

/**
 * Contrato de persistência das respostas do quiz (1:1 com Order).
 * `upsert` permite o quiz salvar a cada etapa de forma idempotente por pedido.
 */
export interface QuizAnswersRepository {
  upsert(answers: QuizAnswers): Promise<void>;
  findByOrderId(tenantId: string, orderId: string): Promise<QuizAnswers | null>;
}
