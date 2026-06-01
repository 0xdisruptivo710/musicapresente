import {
  canTransition,
  type OrderStatus,
} from '@/core/domain/value-objects/order-status';
import { InvalidOrderTransitionError } from '@/core/domain/errors/order-errors';
import type { Money } from '@/core/domain/value-objects/money';
import type { WhatsAppNumber } from '@/core/domain/value-objects/whatsapp-number';

export interface OrderProps {
  id: string;
  tenantId: string;
  customerId: string | null;
  orderNumber: number | null;
  status: OrderStatus;
  packageId: string | null;
  selectedAddons: string[];
  photoCount: number | null;
  whatsapp: string | null;
  amountCents: number | null;
  failureReason: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agregado raiz do funil (CLAUDE.md §5.1). Dono do estado: toda transição
 * passa por aqui e é validada contra a máquina de estados (§5.2).
 */
export class Order {
  private constructor(private readonly props: OrderProps) {}

  /** Cria um novo pedido em DRAFT. */
  static create(input: { tenantId: string; customerId?: string | null }): Order {
    const now = new Date();
    return new Order({
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      customerId: input.customerId ?? null,
      orderNumber: null,
      status: 'draft',
      packageId: null,
      selectedAddons: [],
      photoCount: null,
      whatsapp: null,
      amountCents: null,
      failureReason: null,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Reconstitui um pedido a partir da persistência (usado pelos mappers). */
  static restore(props: OrderProps): Order {
    return new Order({ ...props });
  }

  get id(): string {
    return this.props.id;
  }
  get tenantId(): string {
    return this.props.tenantId;
  }
  get customerId(): string | null {
    return this.props.customerId;
  }
  get orderNumber(): number | null {
    return this.props.orderNumber;
  }
  get status(): OrderStatus {
    return this.props.status;
  }
  get packageId(): string | null {
    return this.props.packageId;
  }
  get whatsapp(): string | null {
    return this.props.whatsapp;
  }
  get amountCents(): number | null {
    return this.props.amountCents;
  }
  get sunoTaskId(): string | null {
    const value = this.props.metadata['sunoTaskId'];
    return typeof value === 'string' ? value : null;
  }

  toPrimitives(): OrderProps {
    return { ...this.props };
  }

  // ---- Transições de estado ----
  completeQuiz(): void {
    this.transitionTo('quiz_completed');
  }
  startLyrics(): void {
    this.transitionTo('lyrics_generating');
  }
  markLyricsReady(): void {
    this.transitionTo('lyrics_ready');
  }
  startMusic(sunoTaskId?: string): void {
    if (sunoTaskId) {
      this.props.metadata = { ...this.props.metadata, sunoTaskId };
    }
    this.transitionTo('music_generating');
  }
  markPreviewReady(): void {
    this.transitionTo('preview_ready');
  }
  awaitPayment(amount: Money): void {
    this.props.amountCents = amount.cents;
    this.transitionTo('awaiting_payment');
  }
  markPaid(): void {
    this.transitionTo('paid');
  }
  markDelivered(): void {
    this.transitionTo('delivered');
  }
  fail(reason: string): void {
    this.props.failureReason = reason;
    this.transitionTo('failed');
  }
  expire(): void {
    this.transitionTo('expired');
  }
  refund(): void {
    this.transitionTo('refunded');
  }

  // ---- Mutações sem transição de estado ----
  captureWhatsApp(number: WhatsAppNumber): void {
    this.props.whatsapp = number.value;
    this.touch();
  }

  choosePackage(packageId: string, addons: string[] = []): void {
    this.props.packageId = packageId;
    this.props.selectedAddons = [...addons];
    this.touch();
  }

  private transitionTo(next: OrderStatus): void {
    if (!canTransition(this.props.status, next)) {
      throw new InvalidOrderTransitionError(this.props.status, next);
    }
    this.props.status = next;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
