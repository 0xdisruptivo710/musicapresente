import type { QuizAnswers } from '@/core/domain/entities/quiz-answers';
import type { QuizAnswersRepository } from '@/core/ports/repositories/quiz-answers-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { QuizAnswersMapper } from '@/infra/db/mappers/quiz-answers-mapper';

/** Implementação do QuizAnswersRepository sobre o Supabase (schema `cancao`). */
export class SupabaseQuizAnswersRepository implements QuizAnswersRepository {
  constructor(private readonly db: CancaoClient) {}

  async upsert(answers: QuizAnswers): Promise<void> {
    const { error } = await this.db
      .from('quiz_answers')
      .upsert(QuizAnswersMapper.toUpsert(answers), { onConflict: 'order_id' });
    if (error) {
      throw new Error(`SupabaseQuizAnswersRepository.upsert: ${error.message}`);
    }
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<QuizAnswers | null> {
    const { data, error } = await this.db
      .from('quiz_answers')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseQuizAnswersRepository.findByOrderId: ${error.message}`);
    }
    return data ? QuizAnswersMapper.toDomain(data) : null;
  }
}
