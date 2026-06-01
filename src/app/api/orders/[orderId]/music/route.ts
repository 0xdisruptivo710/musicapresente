import { makeGenerateMusicUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';

/**
 * POST /api/orders/:orderId/music — dispara a geração da música na Suno
 * (assíncrona). Devolve o taskId; o resultado chega pelo webhook.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const result = await makeGenerateMusicUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
    });
    return Response.json(result, { status: 202 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
