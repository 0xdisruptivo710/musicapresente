import { apiFetch } from "@/shared/http/client";
import type { PackageDTO } from "../types";
import type { OrderDTO, PaymentDTO, PixChargeDTO, SongDTO } from "@/features/quiz/types";

export function getPackages(): Promise<{ packages: PackageDTO[] }> {
  return apiFetch<{ packages: PackageDTO[] }>(`/api/packages`);
}

export function getOrder(orderId: string): Promise<OrderDTO> {
  return apiFetch<OrderDTO>(`/api/orders/${orderId}`);
}

export function getOfferSongs(orderId: string): Promise<{ songs: SongDTO[] }> {
  return apiFetch<{ songs: SongDTO[] }>(`/api/orders/${orderId}/songs`);
}

/** Cria a cobrança PIX do pacote + add-ons escolhidos. */
export function createPayment(
  orderId: string,
  body: { packageId: string; addonCodes: string[] },
): Promise<PixChargeDTO> {
  return apiFetch<PixChargeDTO>(`/api/orders/${orderId}/payment`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getPaymentStatus(orderId: string): Promise<{ payment: PaymentDTO | null }> {
  return apiFetch<{ payment: PaymentDTO | null }>(`/api/orders/${orderId}/payment`);
}
