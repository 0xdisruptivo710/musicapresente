import { TributePage } from '@/core/domain/entities/tribute-page';
import type { TributePageRepository } from '@/core/ports/repositories/tribute-page-repository';
import type { OrderRepository } from '@/core/ports/repositories/order-repository';
import type { SongRepository } from '@/core/ports/repositories/song-repository';
import { OrderNotFoundError } from '@/core/domain/errors/order-errors';
import { slugify } from '@/shared/slug';

export interface CreateTributePageInput {
  tenantId: string;
  orderNumber: number;
  honoreeName: string;
  message: string | null;
  signature: string | null;
  photos: string[];
}

/** Cria e publica uma Página VIP vinculada ao pedido (usado pelo mini-admin). */
export class CreateTributePageUseCase {
  constructor(
    private readonly pages: TributePageRepository,
    private readonly orders: OrderRepository,
    private readonly songs: SongRepository,
  ) {}

  async execute(input: CreateTributePageInput): Promise<{ slug: string }> {
    const order = await this.orders.findByOrderNumber(input.tenantId, input.orderNumber);
    if (!order) {
      throw new OrderNotFoundError(String(input.orderNumber));
    }

    const songs = await this.songs.findByOrderId(input.tenantId, order.id);
    const songId = songs[0]?.id ?? null;
    const slug = `${slugify(input.honoreeName)}-${shortId()}`;

    const page = TributePage.create({
      tenantId: input.tenantId,
      orderId: order.id,
      songId,
      slug,
      honoreeName: input.honoreeName,
      message: input.message,
      signature: input.signature,
      photos: input.photos,
    });
    await this.pages.create(page);
    return { slug };
  }
}

function shortId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6);
}
