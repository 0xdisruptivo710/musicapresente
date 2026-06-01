import { makeGetSongsUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toSongDTO } from '@/shared/api/song-presenter';

/** GET /api/orders/:orderId/songs — músicas (V1/V2) do pedido, para o player. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const songs = await makeGetSongsUseCase().execute({
      tenantId: resolveTenantId(),
      orderId,
    });
    return Response.json({ songs: songs.map(toSongDTO) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
