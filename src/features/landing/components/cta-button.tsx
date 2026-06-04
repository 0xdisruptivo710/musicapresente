import Link from "next/link";
import type { ReactNode } from "react";

/** Botão de chamada para ação principal, leva para o quiz (/criar) com brilho no hover. */
export function CtaButton({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  const pad = size === "lg" ? "px-8 py-4 text-base" : "px-5 py-3 text-sm";
  return (
    <Link
      href="/criar"
      style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)" }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:opacity-95 active:scale-[0.98] ${pad} ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </Link>
  );
}
