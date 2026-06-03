"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "cqe:tour-done";

const STEPS = [
  {
    title: "Sua Galeria 🎵",
    body: "Todas as músicas que você criar ficam salvas aqui pra ouvir quando quiser.",
  },
  {
    title: "Menu ☰",
    body: "Pelo menu você começa uma nova música, vê como funciona e fala com a gente no WhatsApp.",
  },
  {
    title: "Bora criar? ✨",
    body: "Conte a sua história e a nossa IA transforma em uma música personalizada em minutos.",
  },
];

// Lê o flag do localStorage sem setState-em-effect (evita mismatch de hidratação).
function subscribe(): () => void {
  return () => {};
}
function getClientSnapshot(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}
function getServerSnapshot(): boolean {
  return true; // no servidor, trata como "já visto" (não renderiza)
}

/** Tour de boas-vindas (3 passos), só na primeira visita ao app. */
export function WelcomeTour() {
  const alreadyDone = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (alreadyDone || dismissed) return null;
  const current = STEPS[step];
  if (!current) return null;
  const last = step === STEPS.length - 1;

  function close(): void {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // ignora
    }
    setDismissed(true);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" aria-label="Pular tour" onClick={close} className="absolute inset-0 bg-black/70" />
      <div className="absolute right-3 top-[64px] w-[min(92vw,340px)] rounded-2xl border border-violet-500/30 bg-[#12121a] p-4 shadow-2xl">
        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-violet-500/30 bg-[#12121a]" />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">
            Passo {step + 1}/{STEPS.length}
          </div>
          <div className="mt-1 text-base font-semibold text-white">{current.title}</div>
          <p className="mt-1 text-sm text-zinc-300">{current.body}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={close} className="text-xs text-zinc-500 transition hover:text-zinc-300">
              Pular
            </button>
            <div className="flex gap-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5"
                >
                  Voltar
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => (last ? close() : setStep(step + 1))}
                style={{ background: "linear-gradient(90deg,#f97316,#ec4899,#a855f7)" }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {last ? "Começar" : "Próximo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
