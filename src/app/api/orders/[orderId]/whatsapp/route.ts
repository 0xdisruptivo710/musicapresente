import { z } from 'zod';
import { makeCaptureWhatsAppUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';

const bodySchema = z.object({ whatsapp: z.string().min(1) });

/** POST /api/orders/:orderId/whatsapp — captura o WhatsApp do cliente (pré-pagamento). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const raw: unknown = await request.json().catch(() => ({}));
    const { whatsapp } = bodySchema.parse(raw ?? {});
    await makeCaptureWhatsAppUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
      whatsapp,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
