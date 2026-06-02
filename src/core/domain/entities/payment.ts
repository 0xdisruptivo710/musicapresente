import type { PaymentStatus } from '@/core/domain/value-objects/payment-status';

export interface PaymentProps {
  id: string;
  tenantId: string;
  orderId: string;
  provider: string;
  abacatepayId: string | null;
  amountCents: number;
  status: PaymentStatus;
  method: string | null;
  brCode: string | null;
  brCodeBase64: string | null;
  expiresAt: Date | null;
  paidAt: Date | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Cobrança de um pedido (CLAUDE.md §5.1). Dinheiro sempre em centavos. */
export class Payment {
  private constructor(private readonly props: PaymentProps) {}

  static create(input: {
    tenantId: string;
    orderId: string;
    amountCents: number;
    abacatepayId?: string | null;
    brCode?: string | null;
    brCodeBase64?: string | null;
    expiresAt?: Date | null;
    method?: string | null;
    status?: PaymentStatus;
  }): Payment {
    const now = new Date();
    return new Payment({
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      orderId: input.orderId,
      provider: 'abacatepay',
      abacatepayId: input.abacatepayId ?? null,
      amountCents: input.amountCents,
      status: input.status ?? 'pending',
      method: input.method ?? 'pix',
      brCode: input.brCode ?? null,
      brCodeBase64: input.brCodeBase64 ?? null,
      expiresAt: input.expiresAt ?? null,
      paidAt: null,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: PaymentProps): Payment {
    return new Payment({ ...props });
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
  get status(): PaymentStatus {
    return this.props.status;
  }
  get amountCents(): number {
    return this.props.amountCents;
  }
  get brCode(): string | null {
    return this.props.brCode;
  }
  get brCodeBase64(): string | null {
    return this.props.brCodeBase64;
  }
  get abacatepayId(): string | null {
    return this.props.abacatepayId;
  }

  markPaid(): void {
    this.props.status = 'paid';
    this.props.paidAt = new Date();
    this.touch();
  }
  markRefunded(): void {
    this.props.status = 'refunded';
    this.touch();
  }
  markExpired(): void {
    this.props.status = 'expired';
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toPrimitives(): PaymentProps {
    return { ...this.props };
  }
}
