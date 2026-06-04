import { z } from 'zod';
import { makeGenerateLyricsUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toLyricsDTO } from '@/shared/api/lyrics-presenter';

const bodySchema = z.object({ instruction: z.string().trim().max(500).nullish() });

/**
 * POST /api/orders/:orderId/lyrics, gera a letra (1ª vez) ou ajusta a partir
 * da anterior quando `instruction` é enviada. Síncrono (LLM responde rápido).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const raw: unknown = await request.json().catch(() => ({}));
    const { instruction } = bodySchema.parse(raw ?? {});
    const lyrics = await makeGenerateLyricsUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
      instruction: instruction ?? null,
    });
    return Response.json(toLyricsDTO(lyrics), { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
