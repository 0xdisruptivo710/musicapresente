import { ApiError, apiFetch } from "@/shared/http/client";
import type {
  CreateOrderResponse,
  LyricsDTO,
  OrderDTO,
  PaymentDTO,
  PixChargeDTO,
  QuizPayload,
  SongDTO,
} from "@/features/quiz/types";

export function createOrder(): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function saveQuiz(orderId: string, payload: QuizPayload): Promise<OrderDTO> {
  return apiFetch<OrderDTO>(`/api/orders/${orderId}/quiz`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getOrder(orderId: string): Promise<OrderDTO> {
  return apiFetch<OrderDTO>(`/api/orders/${orderId}`);
}

/** Gera a letra (1ª vez) ou ajusta a partir da anterior quando há `instruction`. */
export function generateLyrics(orderId: string, instruction?: string): Promise<LyricsDTO> {
  return apiFetch<LyricsDTO>(`/api/orders/${orderId}/lyrics`, {
    method: "POST",
    body: JSON.stringify(instruction ? { instruction } : {}),
  });
}

/** Dispara a geração da música (Suno, assíncrona). Devolve o taskId. */
export function generateMusic(orderId: string): Promise<{ taskId: string }> {
  return apiFetch<{ taskId: string }>(`/api/orders/${orderId}/music`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/** Lista as músicas (V1/V2) do pedido (vazio enquanto não ficam prontas). */
export function getSongs(orderId: string): Promise<{ songs: SongDTO[] }> {
  return apiFetch<{ songs: SongDTO[] }>(`/api/orders/${orderId}/songs`);
}

/** Envia um áudio (multipart) e devolve a transcrição em texto. */
export async function transcribeAudio(blob: Blob): Promise<{ text: string }> {
  const form = new FormData();
  form.append("audio", blob, "historia.webm");
  const response = await fetch("/api/transcribe", { method: "POST", body: form });
  const raw = await response.text();
  const data: unknown = raw ? JSON.parse(raw) : null;
  if (!response.ok) {
    const body = data as { error?: { message?: string } } | null;
    throw new ApiError(
      response.status,
      "TRANSCRIBE_FAILED",
      body?.error?.message ?? "Falha ao transcrever o áudio.",
    );
  }
  return data as { text: string };
}

/** Cria a cobrança PIX (R$ 39,90) do pedido e devolve o código copia-e-cola + QR. */
export function createPayment(orderId: string): Promise<PixChargeDTO> {
  return apiFetch<PixChargeDTO>(`/api/orders/${orderId}/payment`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/** Consulta o status da última cobrança do pedido (polling até `paid`). */
export function getPayment(orderId: string): Promise<{ payment: PaymentDTO | null }> {
  return apiFetch<{ payment: PaymentDTO | null }>(`/api/orders/${orderId}/payment`);
}

/** Salva o WhatsApp do cliente no pedido (captura antes do pagamento). */
export function captureWhatsapp(orderId: string, whatsapp: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/orders/${orderId}/whatsapp`, {
    method: "POST",
    body: JSON.stringify({ whatsapp }),
  });
}
