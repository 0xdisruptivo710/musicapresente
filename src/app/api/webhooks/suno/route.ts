import { makeHandleSunoCallbackUseCase } from '@/infra/composition/factories';
import { parseSunoCallback } from '@/infra/gateways/suno/suno-callback';

/**
 * POST /api/webhooks/suno, callback da Suno. Processa apenas o estágio final
 * (`complete`); o use case é idempotente. Responde sempre 200 para o provedor
 * não re-tentar em loop. CLAUDE.md §9.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const raw: unknown = await request.json().catch(() => ({}));
    const parsed = parseSunoCallback(raw);
    const isFinal = parsed.callbackType === 'complete' || parsed.callbackType === null;

    if (parsed.taskId && isFinal) {
      await makeHandleSunoCallbackUseCase().execute({
        taskId: parsed.taskId,
        succeeded: parsed.succeeded,
        tracks: parsed.tracks,
      });
    }
  } catch (error) {
    console.error('[webhook/suno] erro ao processar callback:', error);
  }
  return Response.json({ received: true });
}
