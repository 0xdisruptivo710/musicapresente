import { QuizAnswers } from '@/core/domain/entities/quiz-answers';
import type { Database, Json } from '@/infra/db/database.types';
import { toRecord } from '@/infra/db/json';

type QuizAnswersRow = Database['cancao']['Tables']['quiz_answers']['Row'];
type QuizAnswersInsert = Database['cancao']['Tables']['quiz_answers']['Insert'];

/** Converte entre a linha do banco (`cancao.quiz_answers`) e a entidade. */
export const QuizAnswersMapper = {
  toDomain(row: QuizAnswersRow): QuizAnswers {
    return QuizAnswers.restore({
      tenantId: row.tenant_id,
      orderId: row.order_id,
      occasionCategory: row.occasion_category,
      occasionMoment: row.occasion_moment,
      genres: row.genres,
      honoreeName: row.honoree_name,
      story: row.story,
      voiceGender: row.voice_gender,
      extra: toRecord(row.extra),
    });
  },

  toUpsert(answers: QuizAnswers): QuizAnswersInsert {
    const p = answers.toPrimitives();
    return {
      tenant_id: p.tenantId,
      order_id: p.orderId,
      occasion_category: p.occasionCategory,
      occasion_moment: p.occasionMoment,
      genres: p.genres,
      honoree_name: p.honoreeName,
      story: p.story,
      voice_gender: p.voiceGender,
      extra: p.extra as Json,
    };
  },
};
