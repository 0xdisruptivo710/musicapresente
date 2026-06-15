"use client";

import type { ReactNode } from "react";
import type { OptionItem } from "@/features/quiz/data";

const BAR_GRADIENT = "linear-gradient(90deg,#b66d5b,#a05f4e)";

export function GradientButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cta-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function SystemBubble({ children }: { children: ReactNode }) {
  return (
    <div className="animate-rise max-w-[88%] self-start rounded-2xl rounded-tl-sm border border-hair bg-white px-5 py-4 text-[15px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

export function ChoiceCard({
  emoji,
  label,
  sublabel,
}: {
  emoji: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <div
      className="animate-rise flex items-center gap-3 self-end rounded-2xl border border-brand/40 bg-brand/10 px-5 py-3"
      style={{ boxShadow: "0 0 24px -6px rgba(182,109,91,0.40)" }}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="text-right">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand">
          Sua escolha
        </div>
        <div className="font-semibold text-ink">{label}</div>
        {sublabel ? <div className="text-xs text-ink-soft">{sublabel}</div> : null}
      </div>
    </div>
  );
}

export function OptionGrid({
  options,
  onSelect,
  selectedValues = [],
  columns = 3,
  lockUnselected = false,
}: {
  options: OptionItem[];
  onSelect: (option: OptionItem) => void;
  selectedValues?: string[];
  columns?: 2 | 3;
  lockUnselected?: boolean;
}) {
  return (
    <div
      className={`grid gap-3 self-stretch ${columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}
    >
      {options.map((option) => {
        const selected = selectedValues.includes(option.value);
        const disabled = lockUnselected && !selected;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-center transition active:scale-[0.98] ${
              selected
                ? "border-brand bg-brand/15"
                : disabled
                  ? "cursor-not-allowed border-hair bg-white opacity-40"
                  : "border-hair bg-white hover:border-brand/40 hover:bg-surface/40"
            }`}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-sm font-medium text-ink">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ProgressFooter({
  step,
  total,
  label,
  hint,
}: {
  step: number;
  total: number;
  label: string;
  hint?: string;
}) {
  const pct = Math.min(100, Math.round((step / total) * 100));
  return (
    <div className="sticky bottom-0 z-10 mt-6 pt-2">
      <div className="rounded-2xl border border-hair bg-surface/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
          <span>
            Etapa {Math.min(step, total)}/{total}
          </span>
          <span>{label}</span>
        </div>
        {hint ? <div className="mt-1 text-xs text-ink-soft">{hint}</div> : null}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: BAR_GRADIENT }}
          />
        </div>
      </div>
    </div>
  );
}

export function LoadingCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="animate-rise w-full max-w-md self-start rounded-2xl border border-hair bg-white p-6">
      <div className="text-center font-semibold text-ink">{title}</div>
      <div className="mt-1 text-center text-sm italic text-ink-soft">{subtitle}</div>
      <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="animate-indeterminate absolute inset-y-0 left-0 w-1/3 rounded-full"
          style={{ background: BAR_GRADIENT }}
        />
      </div>
    </div>
  );
}
