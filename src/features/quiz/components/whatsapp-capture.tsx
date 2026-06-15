"use client";

import { useState } from "react";

/** Card "Ativar prévias no Zap", captura o WhatsApp enquanto a música é gerada. */
export function WhatsappCapture({
  onSubmit,
  saving,
  error,
}: {
  onSubmit: (whatsapp: string) => void;
  saving: boolean;
  error: Error | null;
}) {
  const [value, setValue] = useState("");
  const valid = value.replace(/\D/g, "").length >= 10;

  return (
    <div className="animate-rise self-stretch rounded-2xl border border-emerald-600/30 bg-emerald-500/[0.07] p-5">
      <div className="flex items-center gap-2 text-emerald-700">
        <span className="text-lg">💬</span>
        <span className="text-sm font-bold uppercase tracking-wide">Ativar prévias no Zap</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Receba as <strong className="text-emerald-700">prévias em áudio</strong> e a música final em{" "}
        <strong className="text-emerald-700">alta qualidade</strong> direto no seu WhatsApp.
      </p>

      <label className="mt-3 block text-[11px] uppercase tracking-widest text-ink-soft">
        Seu WhatsApp
      </label>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputMode="tel"
        placeholder="(31) 99999-9999"
        className="mt-1 w-full rounded-xl border border-hair bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-emerald-600"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null}

      <button
        type="button"
        onClick={() => onSubmit(value)}
        disabled={saving || !valid}
        className="mt-3 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? "Ativando…" : "Receber no Zap 📲"}
      </button>
      <p className="mt-1.5 text-center text-[11px] text-emerald-700/80">
        Digite seu número e ative para receber sua música no Zap!
      </p>
    </div>
  );
}
