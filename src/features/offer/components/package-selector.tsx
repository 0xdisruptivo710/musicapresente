"use client";

import { formatBRL } from "@/shared/format";
import type { PackageDTO } from "../types";

export function PackageSelector({
  packages,
  selectedId,
  onSelect,
  hasPhotoAddon,
  extraPhotos,
  onTogglePhotos,
}: {
  packages: PackageDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasPhotoAddon: boolean;
  extraPhotos: boolean;
  onTogglePhotos: (value: boolean) => void;
}) {
  return (
    <section id="pacotes" className="px-4 py-12 sm:px-6">
      <h2 className="text-center font-serif text-2xl font-bold text-ink sm:text-3xl">
        Escolha o seu <span className="text-gradient">pacote</span>
      </h2>
      <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-ink-soft">
        Acesso vitalício garantido
      </p>

      <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-3">
        {packages.map((pkg, i) => {
          const selected = selectedId === pkg.id;
          const off = pkg.compareAtPriceCents
            ? Math.round((1 - pkg.basePriceCents / pkg.compareAtPriceCents) * 100)
            : null;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelect(pkg.id)}
              className={`relative flex flex-col rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-brand bg-brand/10 shadow-[0_0_40px_-12px_rgba(182,109,91,0.6)]"
                  : "border-hair bg-white hover:border-brand/40"
              }`}
            >
              {i === 1 ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold uppercase text-white">
                  Mais escolhido
                </span>
              ) : null}
              {off ? (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {off}% OFF
                </span>
              ) : null}

              <div className="flex items-center gap-2 pr-12">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                    selected ? "border-brand bg-brand text-white" : "border-hair"
                  }`}
                >
                  {selected ? "✓" : ""}
                </span>
                <span className="text-sm font-semibold text-ink">{pkg.name}</span>
              </div>

              {pkg.compareAtPriceCents ? (
                <div className="mt-3 text-xs text-ink-soft line-through">
                  {formatBRL(pkg.compareAtPriceCents)}
                </div>
              ) : null}
              <div className="text-2xl font-bold text-ink">{formatBRL(pkg.basePriceCents)}</div>

              <ul className="mt-3 flex-1 space-y-1.5 text-xs text-ink-soft">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-4 rounded-xl py-2 text-center text-xs font-bold ${
                  selected
                    ? "bg-brand text-white"
                    : "border border-hair text-ink-soft"
                }`}
              >
                {selected ? "✓ Selecionado" : "Selecionar este plano"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Seletor de fotos do pacote selecionado (se houver add-on) */}
      {hasPhotoAddon ? (
        <div className="mx-auto mt-5 max-w-md rounded-2xl border border-hair bg-white p-4">
          <div className="mb-2 text-center text-[11px] uppercase tracking-widest text-ink-soft">
            Fotos da sua página
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onTogglePhotos(false)}
              className={`rounded-xl px-3 py-2 text-center text-sm ${
                !extraPhotos ? "bg-brand/15 text-brand" : "bg-surface text-ink-soft"
              }`}
            >
              5 fotos <span className="block text-[10px] opacity-70">já inclusas</span>
            </button>
            <button
              type="button"
              onClick={() => onTogglePhotos(true)}
              className={`rounded-xl px-3 py-2 text-center text-sm ${
                extraPhotos ? "bg-brand/15 text-brand" : "bg-surface text-ink-soft"
              }`}
            >
              20 fotos <span className="block text-[10px] opacity-70">+R$10</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
