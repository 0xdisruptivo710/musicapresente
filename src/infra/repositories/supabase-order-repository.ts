import type { Order } from '@/core/domain/entities/order';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { OrderMapper } from '@/infra/db/mappers/order-mapper';

/** Implementação do OrderRepository sobre o Supabase (schema `cancao`). */
export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly db: CancaoClient) {}

  async create(order: Order): Promise<void> {
    const { error } = await this.db.from('orders').insert(OrderMapper.toInsert(order));
    if (error) {
      throw new Error(`SupabaseOrderRepository.create: ${error.message}`);
    }
  }

  async update(order: Order): Promise<void> {
    const { error } = await this.db
      .from('orders')
      .update(OrderMapper.toUpdate(order))
      .eq('tenant_id', order.tenantId)
      .eq('id', order.id);
    if (error) {
      throw new Error(`SupabaseOrderRepository.update: ${error.message}`);
    }
  }

  async findById(tenantId: string, id: string): Promise<Order | null> {
    const { data, error } = await this.db
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseOrderRepository.findById: ${error.message}`);
    }
    return data ? OrderMapper.toDomain(data) : null;
  }

  async findByIdGlobal(id: string): Promise<Order | null> {
    const { data, error } = await this.db
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseOrderRepository.findByIdGlobal: ${error.message}`);
    }
    return data ? OrderMapper.toDomain(data) : null;
  }

  async findBySunoTaskId(sunoTaskId: string): Promise<Order | null> {
    const { data, error } = await this.db
      .from('orders')
      .select('*')
      .filter('metadata->>sunoTaskId', 'eq', sunoTaskId)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabaseOrderRepository.findBySunoTaskId: ${error.message}`);
    }
    return data ? OrderMapper.toDomain(data) : null;
  }
}
