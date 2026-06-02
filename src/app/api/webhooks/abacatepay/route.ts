import { makeHandlePaymentWebhookUseCase } from '@/infra/composition/factories';

/**
 * POST /api/webhooks/abacatepay — confirma pagamento. Valida o `?webhookSecret=`
 * (quando ABACATEPAY_WEBHOOK_SECRET está configurado). O use case é idempotente.
 * Responde sempre 200 para o provedor não re-tentar em loop. CLAUDE.md §9.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const rawBody = await request.text();

    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
    if (expectedSecret) {
      const secret = url.searchParams.get('webhookSecret');
      if (secret !== expectedSecret) {
        return Response.json({ error: 'unauthorized' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody || '{}') as {
      event?: unknown;
      data?: { transparent?: { id?: unknown; externalId?: unknown; status?: unknown } };
    };
    const event = String(payload.event ?? '');
    const transparent = payload.data?.transparent ?? {};
    const status = String(transparent.status ?? '').toUpperCase();

    await makeHandlePaymentWebhookUseCase().execute({
      chargeId: typeof transparent.id === 'string' ? transparent.id : null,
      externalId: typeof transparent.externalId === 'string' ? transparent.externalId : null,
      paid: event === 'transparent.completed' || status === 'PAID',
      refunded: event === 'transparent.refunded' || status === 'REFUNDED',
    });
  } catch (error) {
    console.error('[webhook/abacatepay] erro ao processar:', error);
  }
  return Response.json({ received: true });
}
