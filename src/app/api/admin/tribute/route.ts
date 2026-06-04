import { z } from 'zod';
import { isAdmin, unauthorized } from '@/shared/admin-auth';
import { makeCreateTributePageUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';

const bodySchema = z.object({
  code: z.string().min(1),
  honoreeName: z.string().min(1),
  message: z.string().optional(),
  signature: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

/** POST /api/admin/tribute, cria e publica a Página VIP de um pedido (pelo código). */
export async function POST(request: Request): Promise<Response> {
  if (!isAdmin(request)) return unauthorized();
  try {
    const raw: unknown = await request.json().catch(() => ({}));
    const { code, honoreeName, message, signature, photos } = bodySchema.parse(raw ?? {});

    const orderNumber = Number.parseInt(code.replace(/\D/g, ''), 10);
    if (!Number.isFinite(orderNumber)) {
      return Response.json(
        { error: { code: 'INVALID_CODE', message: 'Código do pedido inválido.' } },
        { status: 400 },
      );
    }

    const result = await makeCreateTributePageUseCase().execute({
      tenantId: resolveTenantId(),
      orderNumber,
      honoreeName,
      message: message ?? null,
      signature: signature ?? null,
      photos,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
