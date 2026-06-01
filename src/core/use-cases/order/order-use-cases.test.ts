import { describe, it, expect, beforeEach } from 'vitest';
import { CreateOrderUseCase } from './create-order.use-case';
import { GetOrderUseCase } from './get-order.use-case';
import { SaveQuizAnswersUseCase } from './save-quiz-answers.use-case';
import { CaptureWhatsAppUseCase } from './capture-whatsapp.use-case';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import {
  InMemoryOrderRepository,
  InMemoryQuizAnswersRepository,
} from '@/test-support/in-memory-repositories';

const TENANT = '11111111-1111-4111-8111-111111111111';

describe('Use cases de Order', () => {
  let orders: InMemoryOrderRepository;
  let quiz: InMemoryQuizAnswersRepository;

  beforeEach(() => {
    orders = new InMemoryOrderRepository();
    quiz = new InMemoryQuizAnswersRepository();
  });

  it('CreateOrder cria um pedido em draft', async () => {
    const { orderId } = await new CreateOrderUseCase(orders).execute({ tenantId: TENANT });
    const order = await orders.findById(TENANT, orderId);
    expect(order?.status).toBe('draft');
    expect(orders.size).toBe(1);
  });

  it('GetOrder retorna o pedido e lança quando inexistente', async () => {
    const { orderId } = await new CreateOrderUseCase(orders).execute({ tenantId: TENANT });
    const get = new GetOrderUseCase(orders);
    expect((await get.execute({ tenantId: TENANT, orderId })).id).toBe(orderId);
    await expect(
      get.execute({ tenantId: TENANT, orderId: 'inexistente' }),
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  });

  it('GetOrder respeita o isolamento por tenant', async () => {
    const { orderId } = await new CreateOrderUseCase(orders).execute({ tenantId: TENANT });
    await expect(
      new GetOrderUseCase(orders).execute({ tenantId: 'outro-tenant', orderId }),
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  });

  it('SaveQuizAnswers salva e transiciona draft → quiz_completed (idempotente na edição)', async () => {
    const { orderId } = await new CreateOrderUseCase(orders).execute({ tenantId: TENANT });
    const save = new SaveQuizAnswersUseCase(orders, quiz);

    await save.execute({
      tenantId: TENANT,
      orderId,
      answers: { occasionCategory: 'Amor & Casal', genres: ['sertanejo', 'pop'] },
    });
    expect((await orders.findById(TENANT, orderId))?.status).toBe('quiz_completed');

    // re-salvar (edição posterior) não quebra nem re-transiciona
    await save.execute({ tenantId: TENANT, orderId, answers: { story: 'nova história' } });
    expect((await orders.findById(TENANT, orderId))?.status).toBe('quiz_completed');
    expect(quiz.upsertCalls).toBe(2);
    expect(await quiz.findByOrderId(TENANT, orderId)).not.toBeNull();
  });

  it('SaveQuizAnswers lança quando o pedido não existe', async () => {
    const save = new SaveQuizAnswersUseCase(orders, quiz);
    await expect(
      save.execute({ tenantId: TENANT, orderId: 'inexistente', answers: {} }),
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  });

  it('CaptureWhatsApp normaliza e persiste', async () => {
    const { orderId } = await new CreateOrderUseCase(orders).execute({ tenantId: TENANT });
    await new CaptureWhatsAppUseCase(orders).execute({
      tenantId: TENANT,
      orderId,
      whatsapp: '(31) 99999-8888',
    });
    expect((await orders.findById(TENANT, orderId))?.whatsapp).toBe('5531999998888');
  });
});
