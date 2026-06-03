export interface TributePageProps {
  id: string;
  tenantId: string;
  orderId: string;
  songId: string | null;
  slug: string;
  title: string | null;
  honoreeName: string | null;
  message: string | null;
  signature: string | null;
  photos: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Página de Homenagem VIP (CLAUDE.md §5.1): fotos + dedicatória + música. */
export class TributePage {
  private constructor(private readonly props: TributePageProps) {}

  static restore(props: TributePageProps): TributePage {
    return new TributePage({ ...props });
  }

  get tenantId(): string {
    return this.props.tenantId;
  }
  get orderId(): string {
    return this.props.orderId;
  }
  get slug(): string {
    return this.props.slug;
  }
  get published(): boolean {
    return this.props.published;
  }

  toPrimitives(): TributePageProps {
    return { ...this.props, photos: [...this.props.photos] };
  }
}
