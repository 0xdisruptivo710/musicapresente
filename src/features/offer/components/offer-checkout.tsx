"use client";

import { useState } from "react";
import type { PixChargeDTO } from "@/features/quiz/types";

const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "";

function qrSrc(base64: string): string {
  return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
}

/** Modal de checkout PIX: gerando → QR/copia-e-cola → aguardando → confirmado. */
export function OfferCheckout({
  open,
  onClose,
  charge,
  paid,
  starting,
  error,
  orderNumber,
}: {
  open: boolean;
  onClose: () => void;
  charge: PixChargeDTO | null;
  paid: boolean;
  starting: boolean;
  error: Error | null;
  orderNumber: number | null;
}) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const orderCode = orderNumber != null ? String(orderNumber).padStart(6, "0") : null;

  async function copyPix(): Promise<void> {
    if (!charge?.brCode) return;
    try {
      await navigator.clipboard.writeText(charge.brCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard indisponível
    }
  }

  const waMsg = encodeURIComponent(
    `Olá! Acabei de comprar minha música personalizada${
      orderCode ? ` (pedido ${orderCode})` : ""
    }. Quero receber o link completo. 🎵`,
  );
  const waUrl = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${waMsg}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#1a0e12] p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">
            {paid ? "Pagamento confirmado" : "Pague com PIX"}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {paid ? (
          <div className="mt-4 text-center">
            <div className="text-4xl">✅</div>
            <div className="mt-2 text-lg font-semibold text-white">Pagamento feito com sucesso!</div>
            <p className="mt-1 text-sm text-zinc-300">
              Sua música está liberada. Feche para ouvir a versão completa.
            </p>
            {orderCode ? (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                <div className="text-[10px] uppercase tracking-widest text-amber-300">
                  Código do seu pedido
                </div>
                <div className="text-2xl font-bold tracking-[0.3em] text-white">{orderCode}</div>
                <p className="mt-1 text-[11px] text-zinc-400">
                  Guarde e envie este código no nosso WhatsApp para receber sua música em alta
                  qualidade.
                </p>
              </div>
            ) : null}
            <p className="mt-3 text-[11px] text-zinc-500">
              Comprou um pacote com Página VIP? Ela é montada com suas fotos e enviada no seu
              WhatsApp em até 24h.
            </p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                📲 Receber o link no WhatsApp
              </a>
            ) : null}
          </div>
        ) : charge ? (
          <div className="mt-4">
            {charge.brCodeBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL (QR)
              <img
                src={qrSrc(charge.brCodeBase64)}
                alt="QR Code do PIX"
                className="mx-auto h-52 w-52 rounded-xl bg-white p-2"
              />
            ) : null}
            <p className="mt-3 text-center text-xs text-zinc-400">
              Abra o app do banco → PIX → Pagar com QR Code, ou copie o código abaixo.
            </p>
            {charge.brCode ? (
              <>
                <div className="mt-3 max-h-20 overflow-auto break-all rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-zinc-300">
                  {charge.brCode}
                </div>
                <button
                  type="button"
                  onClick={() => void copyPix()}
                  className="mt-2 w-full rounded-xl border border-amber-400 bg-amber-500/20 py-2.5 text-sm font-bold text-white transition hover:bg-amber-500/30"
                >
                  {copied ? "Código copiado! ✓" : "Copiar código PIX"}
                </button>
              </>
            ) : null}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
              Aguardando a confirmação do pagamento…
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-zinc-400">
            {error ? (
              <span className="text-red-400">Ops: {error.message}</span>
            ) : starting ? (
              "Gerando seu PIX…"
            ) : (
              "Preparando…"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
