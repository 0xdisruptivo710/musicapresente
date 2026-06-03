"use client";

import Link from "next/link";
import { Logo } from "@/features/landing/components/logo";

/** Barra superior do app (criar): marca + contador + Galeria + Menu. */
export function AppTopbar({
  count,
  onOpenGallery,
  onOpenMenu,
}: {
  count: number;
  onOpenGallery: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#08080c]/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {count}
          </span>
          <button
            type="button"
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 rounded-xl border border-violet-400/40 bg-violet-500/15 px-3 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/25"
          >
            🎵 Galeria
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="rounded-xl border border-white/10 px-2.5 py-1.5 text-zinc-300 transition hover:bg-white/5"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
