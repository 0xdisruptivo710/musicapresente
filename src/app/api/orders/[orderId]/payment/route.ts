import { z } from 'zod';
import { makeCreatePixChargeUseCase, makeGetPaymentUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toPaymentDTO } from '@/shared/api/payment-presenter';

const bodySchema = z.object({
  packageId: z.string().optional(),
  addonCodes: z.array(z.string()).optional(),
  customer: z
    .object({
      name: z.string(),
      email: z.string(),
      taxId: z.string(),
      cellphone: z.string(),
    })
    .optional(),
});

/** POST /api/orders/:orderId/payment, cria a cobrança PIX do pacote escolhido. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const raw: unknown = await request.json().catch(() => ({}));
    const { packageId, addonCodes, customer } = bodySchema.parse(raw ?? {});
    const result = await makeCreatePixChargeUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
      packageId,
      addonCodes,
      customer,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** GET /api/orders/:orderId/payment, status da cobrança (polling do front). */
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
