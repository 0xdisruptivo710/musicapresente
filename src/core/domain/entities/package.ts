/** Add-on opcional de um pacote (ex.: "20 fotos +R$10"). Preço em centavos. */
export interface PackageAddon {
  code: string;
  name: string;
  priceCents: number;
  isDefault: boolean;
}

export interface PackageProps {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description: string | null;
  basePriceCents: number;
  compareAtPriceCents: number | null;
  features: string[];
  addons: PackageAddon[];
  isActive: boolean;
  sortOrder: number;
}

/**
 * Pacote/oferta parametrizável (CLAUDE.md §5.1). Preços vivem no banco, nunca
 * hard-coded. O cálculo do valor final (base + add-ons) é regra de domínio.
 */
export class Package {
  private constructor(private readonly props: PackageProps) {}

  static restore(props: PackageProps): Package {
    return new Package({ ...props });
  }

  get id(): string {
    return this.props.id;
  }
  get tenantId(): string {
    return this.props.tenantId;
  }
  get code(): string {
    return this.props.code;
  }
  get name(): string {
    return this.props.name;
  }
  get basePriceCents(): number {
    return this.props.basePriceCents;
  }
  get addons(): readonly PackageAddon[] {
    return this.props.addons;
  }

  /** Preço final: base + add-ons selecionados (por código). Ignora códigos desconhecidos. */
  priceWithAddons(addonCodes: readonly string[]): number {
    const extra = this.props.addons
      .filter((addon) => addonCodes.includes(addon.code))
      .reduce((sum, addon) => sum + addon.priceCents, 0);
    return this.props.basePriceCents + extra;
  }

  toPrimitives(): PackageProps {
    return {
      ...this.props,
      features: [...this.props.features],
      addons: this.props.addons.map((addon) => ({ ...addon })),
    };
  }
}
