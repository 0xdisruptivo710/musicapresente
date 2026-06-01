import type { OrderStatus } from "@/core/domain/value-objects/order-status";
import type { VoiceGender } from "@/core/domain/value-objects/voice-gender";

/** Espelha o `OrderDTO` devolvido pela API (`shared/api/order-presenter`). */
export interface OrderDTO {
  id: string;
  status: OrderStatus;
  orderNumber: number | null;
  packageId: string | null;
  whatsapp: string | null;
  amountCents: number | null;
}

export interface CreateOrderResponse {
  orderId: string;
}

/** Espelha o `LyricsDTO` devolvido por `POST /api/orders/:id/lyrics`. */
export interface LyricsDTO {
  id: string;
  version: number;
  title: string | null;
  content: string;
  tone: string | null;
}

/** Espelha o `SongDTO` devolvido por `GET /api/orders/:id/songs`. */
export interface SongDTO {
  id: string;
  version: "v1" | "v2";
  audioUrl: string | null;
  title: string | null;
  durationSeconds: number | null;
  imageUrl: string | null;
  locked: boolean;
}

/** Corpo aceito por `PUT /api/orders/:id/quiz`. */
export interface QuizPayload {
  occasionCategory?: string | null;
  occasionMoment?: string | null;
  genres?: string[];
  honoreeName?: string | null;
  story?: string | null;
  voiceGender?: VoiceGender | null;
}
