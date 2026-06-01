import { z } from 'zod';
import { makeCreateOrderUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';

const bodySchema = z.object({ customerId: z.uuid().nullish() });

/** POST /api/orders — abre uma nova sessão do funil (Order em DRAFT). */
export async function POST(request: Request): Promise<Response> {
  try {
    const raw: unknown = await request.json().catch(() => ({}));
    const { customerId } = bodySchema.parse(raw ?? {});
    const result = await makeCreateOrderUseCase().execute({
      tenantId: resolveTenantId(),
      customerId: customerId ?? null,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
