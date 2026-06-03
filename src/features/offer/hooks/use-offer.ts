"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getOfferSongs,
  getOrder,
  getPackages,
  getPaymentStatus,
} from "../api/offer-api";
import type { PackageDTO } from "../types";
import type { PixChargeDTO } from "@/features/quiz/types";

const PHOTO_ADDON = "photos_20";

/** Estado da tela de oferta: pacotes, seleção, add-on de fotos, total e pagamento. */
export function useOffer(orderId: string) {
  const packagesQuery = useQuery({ queryKey: ["packages"], queryFn: getPackages });
  const songsQuery = useQuery({
    queryKey: ["order-songs", orderId],
    queryFn: () => getOfferSongs(orderId),
  });

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
  });

  const packages = useMemo(() => packagesQuery.data?.packages ?? [], [packagesQuery.data]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [extraPhotos, setExtraPhotos] = useState(false);

  // Default = pacote do meio (o "mais escolhido") até o usuário trocar.
  const selected = useMemo<PackageDTO | null>(() => {
    if (packages.length === 0) return null;
    const byId = packages.find((p) => p.id === selectedId);
    return byId ?? packages[Math.min(1, packages.length - 1)] ?? packages[0] ?? null;
  }, [packages, selectedId]);

  const hasPhotoAddon = !!selected?.addons.some((a) => a.code === PHOTO_ADDON);

  const addonCodes = useMemo(
    () => (hasPhotoAddon && extraPhotos ? [PHOTO_ADDON] : []),
    [hasPhotoAddon, extraPhotos],
  );

  const totalCents = useMemo(() => {
    if (!selected) return 0;
    const extra = selected.addons
      .filter((a) => addonCodes.includes(a.code))
      .reduce((sum, a) => sum + a.priceCents, 0);
    return selected.basePriceCents + extra;
  }, [selected, addonCodes]);

  const [charge, setCharge] = useState<PixChargeDTO | null>(null);
  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Selecione um pacote.");
      return createPayment(orderId, { packageId: selected.id, addonCodes });
    },
    onSuccess: (data) => setCharge(data),
  });

  const statusQuery = useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId),
    enabled: charge !== null,
    refetchInterval: (query) =>
      query.state.data?.payment?.status === "paid" ? false : 4000,
  });
  const paid = statusQuery.data?.payment?.status === "paid";

  // Pagamento confirmado → recarrega as músicas (já desbloqueadas).
  const queryClient = useQueryClient();
  useEffect(() => {
    if (paid) {
      void queryClient.invalidateQueries({ queryKey: ["order-songs", orderId] });
    }
  }, [paid, orderId, queryClient]);

  return {
    loading: packagesQuery.isLoading,
    packages,
    selected,
    selectPackage: setSelectedId,
    hasPhotoAddon,
    extraPhotos,
    setExtraPhotos,
    totalCents,
    songs: songsQuery.data?.songs ?? [],
    orderNumber: orderQuery.data?.orderNumber ?? null,
    charge,
    paid,
    startPayment: () => paymentMutation.mutate(),
    paymentStarting: paymentMutation.isPending,
    paymentError: (paymentMutation.error ?? null) as Error | null,
  };
}
