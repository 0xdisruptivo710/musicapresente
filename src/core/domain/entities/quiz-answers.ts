import type { VoiceGender } from '@/core/domain/value-objects/voice-gender';

export interface QuizAnswersProps {
  tenantId: string;
  orderId: string;
  occasionCategory: string | null;
  occasionMoment: string | null;
  genres: string[];
  honoreeName: string | null;
  story: string | null;
  voiceGender: VoiceGender | null;
  extra: Record<string, unknown>;
}

/**
 * Respostas do quiz (CLAUDE.md §5.1), 1:1 com um Order.
 * Persistido pelo QuizAnswersRepository a cada etapa (resiliente a refresh).
 */
export class QuizAnswers {
  private constructor(private readonly props: QuizAnswersProps) {}

  static create(input: {
    tenantId: string;
    orderId: string;
    occasionCategory?: string | null;
    occasionMoment?: string | null;
    genres?: string[];
    honoreeName?: string | null;
    story?: string | null;
    voiceGender?: VoiceGender | null;
    extra?: Record<string, unknown>;
  }): QuizAnswers {
    return new QuizAnswers({
      tenantId: input.tenantId,
      orderId: input.orderId,
      occasionCategory: input.occasionCategory ?? null,
      occasionMoment: input.occasionMoment ?? null,
      genres: input.genres ? [...input.genres] : [],
      honoreeName: input.honoreeName ?? null,
      story: input.story ?? null,
      voiceGender: input.voiceGender ?? null,
      extra: input.extra ?? {},
    });
  }

  static restore(props: QuizAnswersProps): QuizAnswers {
    return new QuizAnswers({ ...props });
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get tenantId(): string {
    return this.props.tenantId;
  }

  toPrimitives(): QuizAnswersProps {
    return { ...this.props };
  }
}
