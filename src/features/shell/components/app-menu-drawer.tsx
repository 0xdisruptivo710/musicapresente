"use client";

import Link from "next/link";
import { Drawer } from "./drawer";

const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "";
const ROW =
  "flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]";

function RowInner({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <>
      <span className="text-xl">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-[11px] uppercase tracking-wider text-zinc-500">{sub}</span>
      </span>
      <span className="text-zinc-600">›</span>
    </>
  );
}

export function AppMenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const support = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        "Olá! Preciso de ajuda com a Canção que Encanta. 🎵",
      )}`
    : null;

  return (
    <Drawer open={open} onClose={onClose} side="right" title="Bem-vindo(a)" subtitle="Menu principal">
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          className={ROW}
          onClick={() => {
            onClose();
            window.location.assign("/criar");
          }}
        >
          <RowInner icon="✨" title="Criar Nova Música" sub="Reiniciar criação" />
        </button>

        <Link href="/#como-funciona" onClick={onClose} className={ROW}>
          <RowInner icon="❓" title="Como Funciona" sub="Veja o passo a passo" />
        </Link>

        {support ? (
          <a href={support} target="_blank" rel="noopener noreferrer" onClick={onClose} className={ROW}>
            <RowInner icon="📞" title="Suporte / Ajuda" sub="Fale conosco no WhatsApp" />
          </a>
        ) : null}
      </div>

      <div className="mt-6 text-center text-[10px] uppercase tracking-widest text-zinc-600">
        Canção que Encanta · v0.1.0
      </div>
    </Drawer>
  );
}
