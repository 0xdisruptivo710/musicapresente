import type { Order } from '@/core/domain/entities/order';

/**
 * Contrato de persistência do agregado Order (CLAUDE.md §3 — Repository Pattern).
 * Implementações ficam em `infra/repositories`. Toda leitura é escopada por tenant.
 */
export interface OrderRepository {
  create(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  findById(tenantId: string, id: string): Promise<Order | null>;
  /** Busca global por id (webhooks não trazem tenant). */
  findByIdGlobal(id: string): Promise<Order | null>;
  /** Busca global pelo taskId da Suno (usado pelo webhook, que não traz tenant). */
  findBySunoTaskId(sunoTaskId: string): Promise<Order | null>;
}
