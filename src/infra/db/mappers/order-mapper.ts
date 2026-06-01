import { Order, type OrderProps } from '@/core/domain/entities/order';
import type { Database, Json } from '@/infra/db/database.types';
import { toRecord, toStringArray } from '@/infra/db/json';

type OrderRow = Database['cancao']['Tables']['orders']['Row'];
type OrderInsert = Database['cancao']['Tables']['orders']['Insert'];
type OrderUpdate = Database['cancao']['Tables']['orders']['Update'];

/** Converte entre a linha do banco (`cancao.orders`) e a entidade Order. */
export const OrderMapper = {
  toDomain(row: OrderRow): Order {
    return Order.restore({
      id: row.id,
      tenantId: row.tenant_id,
      customerId: row.customer_id,
      orderNumber: row.order_number,
      status: row.status,
      packageId: row.package_id,
      selectedAddons: toStringArray(row.selected_addons),
      photoCount: row.photo_count,
      whatsapp: row.whatsapp,
      amountCents: row.amount_cents,
      failureReason: row.failure_reason,
      metadata: toRecord(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  },

  // order_number / created_at / updated_at ficam a cargo dos defaults do banco.
  toInsert(order: Order): OrderInsert {
    const p: OrderProps = order.toPrimitives();
    return {
      id: p.id,
      tenant_id: p.tenantId,
      customer_id: p.customerId,
      status: p.status,
      package_id: p.packageId,
      selected_addons: p.selectedAddons,
      photo_count: p.photoCount,
      whatsapp: p.whatsapp,
      amount_cents: p.amountCents,
      failure_reason: p.failureReason,
      metadata: p.metadata as Json,
    };
  },

  toUpdate(order: Order): OrderUpdate {
    const p: OrderProps = order.toPrimitives();
    return {
      customer_id: p.customerId,
      status: p.status,
      package_id: p.packageId,
      selected_addons: p.selectedAddons,
      photo_count: p.photoCount,
      whatsapp: p.whatsapp,
      amount_cents: p.amountCents,
      failure_reason: p.failureReason,
      metadata: p.metadata as Json,
      updated_at: new Date().toISOString(),
    };
  },
};
