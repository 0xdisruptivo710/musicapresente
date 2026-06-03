/** Espelha o `PackageDTO` de `GET /api/packages` (shared/api/package-presenter). */
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
