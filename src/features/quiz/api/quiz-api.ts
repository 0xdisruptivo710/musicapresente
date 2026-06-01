import { ApiError, apiFetch } from "@/shared/http/client";
import type {
  CreateOrderResponse,
  LyricsDTO,
  OrderDTO,
  QuizPayload,
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
