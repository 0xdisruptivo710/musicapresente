import { makeGetOrderUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toOrderDTO } from '@/shared/api/order-presenter';

/** GET /api/orders/:orderId — estado atual do pedido (escopado por tenant). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const order = await makeGetOrderUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
    });
    return Response.json(toOrderDTO(order));
  } catch (error) {
    return toErrorResponse(error);
  }
}
