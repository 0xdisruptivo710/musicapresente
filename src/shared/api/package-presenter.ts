import type { Package } from '@/core/domain/entities/package';

export interface PackageAddonDTO {
  code: string;
  name: string;
  priceCents: number;
  isDefault: boolean;
}

export interface PackageDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  basePriceCents: number;
  compareAtPriceCents: number | null;
  features: string[];
  addons: PackageAddonDTO[];
}

export function toPackageDTO(pkg: Package): PackageDTO {
  const p = pkg.toPrimitives();
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    description: p.description,
    basePriceCents: p.basePriceCents,
    compareAtPriceCents: p.compareAtPriceCents,
    features: p.features,
    addons: p.addons.map((a) => ({
      code: a.code,
      name: a.name,
      priceCents: a.priceCents,
      isDefault: a.isDefault,
    })),
  };
}
