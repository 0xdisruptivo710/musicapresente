import type { Payment } from '@/core/domain/entities/payment';
import type { PaymentRepository } from '@/core/ports/repositories/payment-repository';
import type { CancaoClient } from '@/infra/db/supabase';
import { PaymentMapper } from '@/infra/db/mappers/payment-mapper';

/** Implementação do PaymentRepository sobre o Supabase (schema `cancao`). */
export class SupabasePaymentRepository implements PaymentRepository {
  constructor(private readonly db: CancaoClient) {}

  async create(payment: Payment): Promise<void> {
    const { error } = await this.db.from('payments').insert(PaymentMapper.toInsert(payment));
    if (error) {
      throw new Error(`SupabasePaymentRepository.create: ${error.message}`);
    }
  }

  async update(payment: Payment): Promise<void> {
    const { error } = await this.db
      .from('payments')
      .update(PaymentMapper.toUpdate(payment))
      .eq('tenant_id', payment.tenantId)
      .eq('id', payment.id);
    if (error) {
      throw new Error(`SupabasePaymentRepository.update: ${error.message}`);
    }
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<Payment | null> {
    const { data, error } = await this.db
      .from('payments')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabasePaymentRepository.findByOrderId: ${error.message}`);
    }
    return data ? PaymentMapper.toDomain(data) : null;
  }

  async findByChargeId(abacatepayId: string): Promise<Payment | null> {
    const { data, error } = await this.db
      .from('payments')
      .select('*')
      .eq('abacatepay_id', abacatepayId)
      .maybeSingle();
    if (error) {
      throw new Error(`SupabasePaymentRepository.findByChargeId: ${error.message}`);
    }
    return data ? PaymentMapper.toDomain(data) : null;
  }
}
