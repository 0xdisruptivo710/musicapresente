import { WhatsAppNumber } from '@/core/domain/value-objects/whatsapp-number';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';

export interface CaptureWhatsAppInput {
  tenantId: string;
  orderId: string;
  whatsapp: string;
}

/**
 * Captura o WhatsApp do cliente antes do pagamento (alavanca de conversão /
 * recuperação, CLAUDE.md §1, §5.3). Normaliza e valida o número.
 */
export class CaptureWhatsAppUseCase {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: CaptureWhatsAppInput): Promise<void> {
    const order = await this.orders.findById(input.tenantId, input.orderId);
    if (!order) {
      throw new OrderNotFoundError(input.orderId);
    }
    order.captureWhatsApp(WhatsAppNumber.create(input.whatsapp));
    await this.orders.update(order);
  }
}
