"use client";

import { useState } from "react";
import type { PixChargeDTO } from "@/features/quiz/types";

/** Número de WhatsApp do negócio (formato internacional só dígitos, ex: 5511999999999). */
const BUSINESS_WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "";

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function qrSrc(base64: string): string {
  return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
}

interface PaymentPanelProps {
  charge: PixChargeDTO | null;
  paid: boolean;
  starting: boolean;
  error: Error | null;
  onStart: () => void;
  orderNumber: number | null;
  priceCents?: number;
}

/** Paywall do passo 6: oferta → cobrança PIX (QR + copia-e-cola) → confirmação + WhatsApp. */
export function PaymentPanel({
  charge,
  paid,
  starting,
  error,
  onStart,
  orderNumber,
  priceCents = 3990,
}: PaymentPanelProps) {
  const [copied, setCopied] = useState(false);

  async function copyPix(): Promise<void> {
    if (!charge?.brCode) return;
    try {
      await navigator.clipboard.writeText(charge.brCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard indisponível, usuário seleciona e copia manualmente
    }
  }

  // 1) Pagamento confirmado, sucesso + WhatsApp
  if (paid) {
    const message = encodeURIComponent(
      `Olá! Acabei de comprar minha música personalizada${
        orderNumber ? ` (pedido #${orderNumber})` : ""
      }. Quero receber o link completo. 🎵`,
    );
    const waUrl = BUSINESS_WHATSAPP ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${message}` : null;
    return (
      <div className="animate-rise self-stretch rounded-2xl border border-emerald-600/30 bg-emerald-500/[0.08] p-5 text-center">
        <div className="text-3xl">✅</div>
        <div className="mt-1 text-lg font-semibold text-ink">Pagamento confirmado!</div>
        <p className="mt-1 text-sm text-ink-soft">
          Sua música completa está liberada. Toque acima para ouvir inteira.
        </p>
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            📲 Receber o link no WhatsApp
          </a>
        ) : (
          <p className="mt-3 text-xs text-ink-soft">
            Em instantes entraremos em contato pelo WhatsApp com o link da sua música.
          </p>
        )}
      </div>
    );
  }

  // 2) Cobrança criada, QR + copia-e-cola + aguardando confirmação
  if (charge) {
    return (
      <div className="animate-rise self-stretch rounded-2xl border border-brand/30 bg-white p-5">
        <div className="text-center text-[11px] font-semibold uppercase tracking-widest text-brand">
          Pague {formatBRL(charge.amountCents)} via PIX
        </div>
        {charge.brCodeBase64 ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL (QR), next/image não cabe
          <img
            src={qrSrc(charge.brCodeBase64)}
            alt="QR Code do PIX"
            className="mx-auto mt-4 h-52 w-52 rounded-xl bg-white p-2"
          />
        ) : null}
        <p className="mt-3 text-center text-xs text-ink-soft">
          Abra o app do seu banco → PIX → Pagar com QR Code, ou copie o código abaixo.
        </p>
        {charge.brCode ? (
          <div className="mt-3">
            <div className="max-h-20 overflow-auto break-all rounded-xl border border-hair bg-surface/60 px-3 py-2 text-[11px] text-ink-soft">
              {charge.brCode}
            </div>
            <button
              type="button"
              onClick={() => void copyPix()}
              className="mt-2 w-full rounded-xl border border-brand bg-brand/15 py-2.5 text-sm font-bold text-brand-deep transition hover:bg-brand/25"
            >
              {copied ? "Código copiado! ✓" : "Copiar código PIX"}
            </button>
          </div>
        ) : null}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <span className="h-2 w-2 animate-ping rounded-full bg-brand" />
          Aguardando a confirmação do pagamento…
        </div>
        <p className="mt-1 text-center text-xs text-ink-soft">
          A confirmação é automática e leva alguns segundos após o pagamento.
        </p>
      </div>
    );
  }

  // 3) Oferta, CTA inicial
  return (
    <div className="animate-rise self-stretch rounded-2xl border border-brand/30 bg-gradient-to-b from-brand/10 to-transparent p-5 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-brand">
        Desbloqueie a música completa
      </div>
      <div className="mt-2 flex items-baseline justify-center gap-1.5">
        <span className="text-3xl font-bold text-ink">{formatBRL(priceCents)}</span>
        <span className="text-sm text-ink-soft">pagamento único</span>
      </div>
      <ul className="mx-auto mt-3 max-w-xs space-y-1 text-left text-sm text-ink-soft">
        <li>🎵 Música completa em alta qualidade</li>
        <li>💜 Letra 100% personalizada com a sua história</li>
        <li>📲 Link enviado no seu WhatsApp</li>
      </ul>
      {error ? <p className="mt-3 text-sm text-red-500">Ops: {error.message}</p> : null}
      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className="cta-gradient mt-4 w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {starting ? "Gerando PIX…" : "Pagar com PIX 🔓"}
      </button>
      <p className="mt-2 text-xs text-ink-soft">Pagamento seguro via PIX (AbacatePay).</p>
    </div>
  );
}
