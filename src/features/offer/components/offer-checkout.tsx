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
        className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-hair bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-ink">
            {paid ? "Pagamento confirmado" : "Pague com PIX"}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-ink-soft hover:text-ink">
            ✕
          </button>
        </div>

        {paid ? (
          <div className="mt-4 text-center">
            <div className="text-4xl">✅</div>
            <div className="mt-2 text-lg font-semibold text-ink">Pagamento feito com sucesso!</div>
            <p className="mt-1 text-sm text-ink-soft">
              Sua música está liberada. Feche para ouvir a versão completa.
            </p>
            {orderCode ? (
              <div className="mt-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3">
                <div className="text-[10px] uppercase tracking-widest text-brand">
                  Código do seu pedido
                </div>
                <div className="text-2xl font-bold tracking-[0.3em] text-ink">{orderCode}</div>
                <p className="mt-1 text-[11px] text-ink-soft">
                  Guarde e envie este código no nosso WhatsApp para receber sua música em alta
                  qualidade.
                </p>
              </div>
            ) : null}
            <p className="mt-3 text-[11px] text-ink-soft">
              Comprou um pacote com Página VIP? Ela é montada com suas fotos e enviada no seu
              WhatsApp em até 24h.
            </p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
            <p className="mt-3 text-center text-xs text-ink-soft">
              Abra o app do banco → PIX → Pagar com QR Code, ou copie o código abaixo.
            </p>
            {charge.brCode ? (
              <>
                <div className="mt-3 max-h-20 overflow-auto break-all rounded-xl border border-hair bg-surface px-3 py-2 text-[11px] text-ink-soft">
                  {charge.brCode}
                </div>
                <button
                  type="button"
                  onClick={() => void copyPix()}
                  className="mt-2 w-full rounded-xl border border-brand bg-brand/10 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/15"
                >
                  {copied ? "Código copiado! ✓" : "Copiar código PIX"}
                </button>
              </>
            ) : null}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-soft">
              <span className="h-2 w-2 animate-ping rounded-full bg-brand" />
              Aguardando a confirmação do pagamento…
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-ink-soft">
            {error ? (
              <span className="text-red-500">Ops: {error.message}</span>
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
