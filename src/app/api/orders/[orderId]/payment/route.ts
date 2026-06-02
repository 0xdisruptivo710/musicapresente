import { z } from 'zod';
import { makeCreatePixChargeUseCase, makeGetPaymentUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toPaymentDTO } from '@/shared/api/payment-presenter';

const bodySchema = z.object({
  customer: z
    .object({
      name: z.string(),
      email: z.string(),
      taxId: z.string(),
      cellphone: z.string(),
    })
    .optional(),
});

/** POST /api/orders/:orderId/payment — cria a cobrança PIX (R$ 39,90). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const raw: unknown = await request.json().catch(() => ({}));
    const { customer } = bodySchema.parse(raw ?? {});
    const result = await makeCreatePixChargeUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
      customer,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** GET /api/orders/:orderId/payment — status da cobrança (polling do front). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const payment = await makeGetPaymentUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
    });
    return Response.json({ payment: payment ? toPaymentDTO(payment) : null });
  } catch (error) {
    return toErrorResponse(error);
  }
}
