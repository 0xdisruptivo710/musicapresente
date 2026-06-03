"use client";

import { formatBRL } from "@/shared/format";

/** Barra fixa de pagamento (sempre visível na oferta). */
export function StickyPayBar({
  totalCents,
  onPay,
  busy,
}: {
  totalCents: number;
  onPay: () => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0c0c14]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">Total a pagar</div>
          <div className="text-lg font-bold text-white">
            {formatBRL(totalCents)} <span className="text-xs font-normal text-zinc-400">PIX</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onPay}
          disabled={busy || totalCents <= 0}
          style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
          className="flex-1 rounded-2xl py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {busy ? "Gerando PIX…" : "⚡ Pagar no Pix"}
        </button>
      </div>
    </div>
  );
}
