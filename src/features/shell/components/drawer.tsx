"use client";

import type { ReactNode } from "react";

/** Painel lateral deslizante (menu/galeria), com backdrop acessível. */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  side?: "left" | "right";
}) {
  const hidden = side === "right" ? "translate-x-full" : "-translate-x-full";
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute top-0 flex h-full w-[86%] max-w-sm flex-col bg-page shadow-2xl transition-transform duration-300 ${
          side === "right" ? "right-0 border-l" : "left-0 border-r"
        } border-hair ${open ? "translate-x-0" : hidden}`}
      >
        <div className="flex items-center justify-between border-b border-hair px-5 py-4">
          <div>
            {subtitle ? (
              <div className="text-[10px] uppercase tracking-widest text-ink-soft">{subtitle}</div>
            ) : null}
            <div className="text-base font-semibold text-ink">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg px-2 py-1 text-ink-soft transition hover:text-ink"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
