"use client";

import { useState } from "react";
import { GradientButton } from "./primitives";

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-hair bg-surface/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">
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
    <div className="animate-rise self-stretch rounded-2xl border border-hair bg-white p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        {ritmo ? <Tag label={`Ritmo: ${ritmo}`} /> : null}
        {tom ? <Tag label={`Tom: ${tom}`} /> : null}
        {ocasiao ? <Tag label={`Ocasião: ${ocasiao}`} /> : null}
      </div>
      {title ? <h3 className="mb-3 font-serif text-lg font-semibold text-ink">{title}</h3> : null}
      <p className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-ink">
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
          className="rounded-xl border border-hair bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-brand/40 hover:bg-surface/40 disabled:opacity-40"
        >
          ✏️ Ajustar a letra
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={busy}
          className="rounded-xl border border-hair bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-brand/40 hover:bg-surface/40 disabled:opacity-40"
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
        className="rounded-xl border border-hair bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-brand"
      />
      <div className="flex gap-2">
        <GradientButton type="submit" disabled={!text.trim() || busy}>
          Aplicar ajuste
        </GradientButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
