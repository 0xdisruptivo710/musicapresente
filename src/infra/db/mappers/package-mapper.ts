import { Package, type PackageAddon } from '@/core/domain/entities/package';
import type { Database, Json } from '@/infra/db/database.types';
import { toStringArray } from '@/infra/db/json';

type PackageRow = Database['cancao']['Tables']['packages']['Row'];

/** Converte o jsonb `addons` em PackageAddon[] de forma segura. */
function toAddons(value: Json | null): PackageAddon[] {
  if (!Array.isArray(value)) return [];
  const addons: PackageAddon[] = [];
  for (const item of value) {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;
    const code = record['code'];
    const name = record['name'];
    if (typeof code !== 'string' || typeof name !== 'string') continue;
    const price = record['price_cents'];
    addons.push({
      code,
      name,
      priceCents: typeof price === 'number' ? price : 0,
      isDefault: record['default'] === true,
    });
  }
  return addons;
}

/** Converte a linha de `cancao.packages` na entidade Package. */
export const PackageMapper = {
  toDomain(row: PackageRow): Package {
    return Package.restore({
      id: row.id,
      tenantId: row.tenant_id,
      code: row.code,
      name: row.name,
      description: row.description,
      basePriceCents: row.base_price_cents,
      compareAtPriceCents: row.compare_at_price_cents,
      features: toStringArray(row.features),
      addons: toAddons(row.addons),
      isActive: row.is_active,
      sortOrder: row.sort_order,
    });
  },
};
