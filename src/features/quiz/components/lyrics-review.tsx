"use client";

import { useState } from "react";
import { GradientButton } from "./primitives";

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
      {label}
    </span>
  );
}

export function LyricsCard({
  title,
  content,
  ritmo,
  tom,
  ocasiao,
}: {
  title: string | null;
  content: string;
  ritmo: string | null;
  tom: string | null;
  ocasiao: string | null;
}) {
  return (
    <div className="animate-rise self-stretch rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        {ritmo ? <Tag label={`Ritmo: ${ritmo}`} /> : null}
        {tom ? <Tag label={`Tom: ${tom}`} /> : null}
        {ocasiao ? <Tag label={`Ocasião: ${ocasiao}`} /> : null}
      </div>
      {title ? <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3> : null}
      <p className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-zinc-200">
        {content}
      </p>
    </div>
  );
}

/** Caixa de ajuste por instrução + botão de regenerar do zero. */
export function AdjustBox({
  onAdjust,
  onRegenerate,
  busy,
}: {
  onAdjust: (instruction: string) => void;
  onRegenerate: () => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  if (!open) {
    return (
      <div className="flex flex-wrap gap-2 self-stretch">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={busy}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.07] disabled:opacity-40"
        >
          ✏️ Ajustar a letra
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={busy}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.07] disabled:opacity-40"
        >
          🔄 Gerar outra versão
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 self-stretch"
      onSubmit={(event) => {
        event.preventDefault();
        const value = text.trim();
        if (!value) return;
        onAdjust(value);
        setText("");
        setOpen(false);
      }}
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ex.: deixe mais alegre, cite nosso cachorro, encurte o refrão..."
        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-400"
      />
      <div className="flex gap-2">
        <GradientButton type="submit" disabled={!text.trim() || busy}>
          Aplicar ajuste
        </GradientButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-2xl px-4 py-3.5 text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
