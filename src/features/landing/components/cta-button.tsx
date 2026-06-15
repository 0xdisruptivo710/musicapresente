import Link from "next/link";
import type { ReactNode } from "react";

/** Botão de chamada para ação principal, leva para o quiz (/criar). Terracota. */
export function CtaButton({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  const pad = size === "lg" ? "px-8 py-5 text-base" : "px-5 py-3 text-sm";
  return (
    <Link
      href="/criar"
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand font-semibold text-white shadow-lg shadow-brand/25 transition duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-xl hover:shadow-brand/30 active:scale-[0.98] ${pad} ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </Link>
  );
}
