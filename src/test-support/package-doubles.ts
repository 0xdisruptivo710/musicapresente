import { Package, type PackageProps } from '@/core/domain/entities/package';
import type { PackageRepository } from '@/core/ports/repositories/package-repository';

export class InMemoryPackageRepository implements PackageRepository {
  readonly items: Package[] = [];

  seed(props: PackageProps): Package {
    const pkg = Package.restore(props);
    this.items.push(pkg);
    return pkg;
  }

  async listActive(tenantId: string): Promise<Package[]> {
    return this.items
      .filter((p) => p.tenantId === tenantId && p.toPrimitives().isActive)
      .sort((a, b) => a.toPrimitives().sortOrder - b.toPrimitives().sortOrder);
  }

  async findById(tenantId: string, id: string): Promise<Package | null> {
    return this.items.find((p) => p.tenantId === tenantId && p.id === id) ?? null;
  }

  async findByCode(tenantId: string, code: string): Promise<Package | null> {
    return this.items.find((p) => p.tenantId === tenantId && p.code === code) ?? null;
  }
}
