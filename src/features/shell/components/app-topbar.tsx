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
    <header className="sticky top-0 z-40 border-b border-hair bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-hair px-2.5 py-1.5 text-xs text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {count}
          </span>
          <button
            type="button"
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 rounded-xl border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/15"
          >
            🎵 Galeria
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="rounded-xl border border-hair px-2.5 py-1.5 text-ink-soft transition hover:bg-surface/40"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
