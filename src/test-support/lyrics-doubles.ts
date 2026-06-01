import { Lyrics, type LyricsProps } from '@/core/domain/entities/lyrics';
import type { LyricsRepository } from '@/core/ports/repositories/lyrics-repository';
import type {
  GeneratedLyrics,
  LyricsGateway,
  LyricsGenerationParams,
} from '@/core/ports/gateways/lyrics-gateway';

export class InMemoryLyricsRepository implements LyricsRepository {
  private readonly records: LyricsProps[] = [];

  async save(lyrics: Lyrics): Promise<void> {
    this.records.push(lyrics.toPrimitives());
  }

  async findLatestByOrderId(tenantId: string, orderId: string): Promise<Lyrics | null> {
    const latest = this.records
      .filter((r) => r.tenantId === tenantId && r.orderId === orderId)
      .sort((a, b) => b.version - a.version)[0];
    return latest ? Lyrics.restore(latest) : null;
  }
}

/** Gateway de letra falso (determinístico) para testes — não chama a OpenAI. */
export class FakeLyricsGateway implements LyricsGateway {
  readonly calls: LyricsGenerationParams[] = [];

  async generate(params: LyricsGenerationParams): Promise<GeneratedLyrics> {
    this.calls.push(params);
    const adjust = params.instruction ? ` [ajuste: ${params.instruction}]` : '';
    return {
      title: `Canção para ${params.honoreeName ?? 'você'}`,
      content: `[Verso]\nUma letra para ${params.honoreeName ?? 'você'}${adjust}`,
      tone: 'romântico',
      model: 'fake-llm',
    };
  }
}
