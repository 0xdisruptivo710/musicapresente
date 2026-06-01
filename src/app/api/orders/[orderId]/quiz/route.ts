import { z } from 'zod';
import { makeGetOrderUseCase, makeSaveQuizAnswersUseCase } from '@/infra/composition/factories';
import { resolveTenantId } from '@/shared/tenant';
import { toErrorResponse } from '@/shared/api/error-response';
import { toOrderDTO } from '@/shared/api/order-presenter';

const quizSchema = z.object({
  occasionCategory: z.string().nullish(),
  occasionMoment: z.string().nullish(),
  genres: z.array(z.string()).optional(),
  honoreeName: z.string().nullish(),
  story: z.string().nullish(),
  voiceGender: z.enum(['m', 'f']).nullish(),
});

/** PUT /api/orders/:orderId/quiz — salva as respostas do quiz (upsert) e
 *  transiciona DRAFT → QUIZ_COMPLETED na primeira vez. Devolve o pedido. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  try {
    const { orderId } = await params;
    const answers = quizSchema.parse(await request.json());
    const tenantId = resolveTenantId();

    await makeSaveQuizAnswersUseCase().execute({ tenantId, orderId, answers });
    const order = await makeGetOrderUseCase().execute({ tenantId, orderId });
    return Response.json(toOrderDTO(order));
  } catch (error) {
    return toErrorResponse(error);
  }
}
