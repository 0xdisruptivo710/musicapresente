import { makeGetPackagesUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toPackageDTO } from '@/shared/api/package-presenter';

/** GET /api/packages — pacotes ativos para a tela de oferta. */
export async function GET(): Promise<Response> {
  try {
    const packages = await makeGetPackagesUseCase().execute({ tenantId: resolveTenantId() });
    return Response.json({ packages: packages.map(toPackageDTO) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
