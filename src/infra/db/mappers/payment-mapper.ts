import { Payment } from '@/core/domain/entities/payment';
import type { Database, Json } from '@/infra/db/database.types';
import { toRecord } from '@/infra/db/json';

type PaymentRow = Database['cancao']['Tables']['payments']['Row'];
type PaymentInsert = Database['cancao']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['cancao']['Tables']['payments']['Update'];

/** Converte entre a linha do banco (`cancao.payments`) e a entidade Payment. */
export const PaymentMapper = {
  toDomain(row: PaymentRow): Payment {
    return Payment.restore({
      id: row.id,
      tenantId: row.tenant_id,
      orderId: row.order_id,
      provider: row.provider,
      abacatepayId: row.abacatepay_id,
      amountCents: row.amount_cents,
      status: row.status,
      method: row.method,
      brCode: row.br_code,
      brCodeBase64: row.br_code_base64,
      expiresAt: row.expires_at ? new Date(row.expires_at) : null,
      paidAt: row.paid_at ? new Date(row.paid_at) : null,
      metadata: toRecord(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  },

  toInsert(payment: Payment): PaymentInsert {
    const p = payment.toPrimitives();
    return {
      id: p.id,
      tenant_id: p.tenantId,
      order_id: p.orderId,
      provider: p.provider,
      abacatepay_id: p.abacatepayId,
      amount_cents: p.amountCents,
      status: p.status,
      method: p.method,
      br_code: p.brCode,
      br_code_base64: p.brCodeBase64,
      expires_at: p.expiresAt ? p.expiresAt.toISOString() : null,
      paid_at: p.paidAt ? p.paidAt.toISOString() : null,
      metadata: p.metadata as Json,
    };
  },

  toUpdate(payment: Payment): PaymentUpdate {
    const p = payment.toPrimitives();
    return {
      abacatepay_id: p.abacatepayId,
      status: p.status,
      br_code: p.brCode,
      br_code_base64: p.brCodeBase64,
      expires_at: p.expiresAt ? p.expiresAt.toISOString() : null,
      paid_at: p.paidAt ? p.paidAt.toISOString() : null,
      metadata: p.metadata as Json,
      updated_at: new Date().toISOString(),
    };
  },
};
