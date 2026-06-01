import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { SupabaseOrderRepository } from '@/infra/repositories/supabase-order-repository';
import { Order } from '@/core/domain/entities/order';
import type { Database } from '@/infra/db/database.types';

// Carrega .env.local manualmente (o vitest não popula process.env a partir dele).
function loadEnvLocal(): void {
  const content = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && match[1] && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2] ?? '';
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const tenantId = process.env.DEFAULT_TENANT_ID ?? '';

describe('e2e: SupabaseOrderRepository contra o banco real', () => {
  it('cria, lê (com isolamento por tenant) e remove um Order em cancao.orders', async () => {
    expect(url, 'NEXT_PUBLIC_SUPABASE_URL ausente').toBeTruthy();
    expect(serviceKey, 'SUPABASE_SERVICE_ROLE_KEY ausente').toBeTruthy();
    expect(tenantId, 'DEFAULT_TENANT_ID ausente').toBeTruthy();

    const db = createClient<Database, 'cancao'>(url, serviceKey, {
      db: { schema: 'cancao' },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const repo = new SupabaseOrderRepository(db);

    const order = Order.create({ tenantId });
    await repo.create(order);

    try {
      const found = await repo.findById(tenantId, order.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(order.id);
      expect(found?.status).toBe('draft');
      expect(found?.orderNumber).not.toBeNull();

      // isolamento: outro tenant não enxerga o pedido
      const otherTenant = await repo.findById('00000000-0000-4000-8000-000000000000', order.id);
      expect(otherTenant).toBeNull();
    } finally {
      await db.from('orders').delete().eq('id', order.id);
    }

    // confirma a limpeza
    expect(await repo.findById(tenantId, order.id)).toBeNull();
  });
});
