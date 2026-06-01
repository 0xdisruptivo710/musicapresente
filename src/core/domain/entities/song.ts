import type { SongVersion } from '@/core/domain/value-objects/song-version';

export interface SongProps {
  id: string;
  tenantId: string;
  orderId: string;
  version: SongVersion;
  sunoTaskId: string | null;
  sunoAudioId: string | null;
  sunoAudioUrl: string | null;
  title: string | null;
  style: string | null;
  durationSeconds: number | null;
  previewUrl: string | null;
  fullPath: string | null;
  imageUrl: string | null;
  tags: string[];
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Uma versão da música (V1/V2) de um pedido (CLAUDE.md §5.1). Nasce `locked`
 * com a URL temporária da Suno; o pipeline de áudio (Passo 6) re-hospeda e gera
 * a prévia trimada.
 */
export class Song {
  private constructor(private readonly props: SongProps) {}

  static create(input: {
    tenantId: string;
    orderId: string;
    version: SongVersion;
    sunoTaskId?: string | null;
    sunoAudioId?: string | null;
    sunoAudioUrl?: string | null;
    title?: string | null;
    style?: string | null;
    durationSeconds?: number | null;
    imageUrl?: string | null;
    tags?: string[];
  }): Song {
    const now = new Date();
    return new Song({
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      orderId: input.orderId,
      version: input.version,
      sunoTaskId: input.sunoTaskId ?? null,
      sunoAudioId: input.sunoAudioId ?? null,
      sunoAudioUrl: input.sunoAudioUrl ?? null,
      title: input.title ?? null,
      style: input.style ?? null,
      durationSeconds: input.durationSeconds ?? null,
      previewUrl: null,
      fullPath: null,
      imageUrl: input.imageUrl ?? null,
      tags: input.tags ? [...input.tags] : [],
      locked: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: SongProps): Song {
    return new Song({ ...props });
  }

  get id(): string {
    return this.props.id;
  }
  get orderId(): string {
    return this.props.orderId;
  }
  get version(): SongVersion {
    return this.props.version;
  }

  toPrimitives(): SongProps {
    return { ...this.props };
  }
}
