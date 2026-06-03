import type { Package } from '@/core/domain/entities/package';
import type { PackageRepository } from '@/core/ports/repositories/package-repository';

/** Lista os pacotes ativos para montar a tela de oferta. */
export class GetPackagesUseCase {
  constructor(private readonly packages: PackageRepository) {}

  execute(input: { tenantId: string }): Promise<Package[]> {
    return this.packages.listActive(input.tenantId);
  }
}
