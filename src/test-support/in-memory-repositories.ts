import { Order, type OrderProps } from '@/core/domain/entities/order';
import { QuizAnswers, type QuizAnswersProps } from '@/core/domain/entities/quiz-answers';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { QuizAnswersRepository } from '@/core/ports/repositories/quiz-answers-repository';

/**
 * Test doubles em memória para os repositories. Guardam snapshots (toPrimitives)
 * para simular persistência real, mudanças só "persistem" via create/update/upsert.
 */
export class InMemoryOrderRepository implements OrderRepository {
  private readonly records = new Map<string, OrderProps>();

  private key(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  async create(order: Order): Promise<void> {
    this.records.set(this.key(order.tenantId, order.id), order.toPrimitives());
  }

  async update(order: Order): Promise<void> {
    this.records.set(this.key(order.tenantId, order.id), order.toPrimitives());
  }

  async findById(tenantId: string, id: string): Promise<Order | null> {
    const props = this.records.get(this.key(tenantId, id));
    return props ? Order.restore(props) : null;
  }

  async findByIdGlobal(id: string): Promise<Order | null> {
    for (const props of this.records.values()) {
      if (props.id === id) return Order.restore(props);
    }
    return null;
  }

  async findBySunoTaskId(sunoTaskId: string): Promise<Order | null> {
    for (const props of this.records.values()) {
      if (props.metadata['sunoTaskId'] === sunoTaskId) return Order.restore(props);
    }
    return null;
  }

  async findByOrderNumber(tenantId: string, orderNumber: number): Promise<Order | null> {
    for (const props of this.records.values()) {
      if (props.tenantId === tenantId && props.orderNumber === orderNumber) {
        return Order.restore(props);
      }
    }
    return null;
  }

  get size(): number {
    return this.records.size;
  }
}

export class InMemoryQuizAnswersRepository implements QuizAnswersRepository {
  private readonly records = new Map<string, QuizAnswersProps>();
  upsertCalls = 0;

  private key(tenantId: string, orderId: string): string {
    return `${tenantId}:${orderId}`;
  }

  async upsert(answers: QuizAnswers): Promise<void> {
    this.upsertCalls += 1;
    this.records.set(this.key(answers.tenantId, answers.orderId), answers.toPrimitives());
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<QuizAnswers | null> {
    const props = this.records.get(this.key(tenantId, orderId));
    return props ? QuizAnswers.restore(props) : null;
  }
}
