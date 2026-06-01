export interface LyricsProps {
  id: string;
  tenantId: string;
  orderId: string;
  version: number;
  title: string | null;
  content: string;
  tone: string | null;
  model: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Letra gerada para um pedido (CLAUDE.md §5.1). Versionada: cada geração/ajuste
 * cria uma nova versão vinculada ao mesmo Order.
 */
export class Lyrics {
  private constructor(private readonly props: LyricsProps) {}

  static create(input: {
    tenantId: string;
    orderId: string;
    version: number;
    content: string;
    title?: string | null;
    tone?: string | null;
    model?: string | null;
  }): Lyrics {
    const now = new Date();
    return new Lyrics({
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      orderId: input.orderId,
      version: input.version,
      title: input.title ?? null,
      content: input.content,
      tone: input.tone ?? null,
      model: input.model ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: LyricsProps): Lyrics {
    return new Lyrics({ ...props });
  }

  get id(): string {
    return this.props.id;
  }
  get orderId(): string {
    return this.props.orderId;
  }
  get tenantId(): string {
    return this.props.tenantId;
  }
  get version(): number {
    return this.props.version;
  }
  get content(): string {
    return this.props.content;
  }
  get title(): string | null {
    return this.props.title;
  }
  get tone(): string | null {
    return this.props.tone;
  }

  toPrimitives(): LyricsProps {
    return { ...this.props };
  }
}
