"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "A IA está lendo a sua história e já pegou um lenço de papel... 🥹",
  "Escolhendo cada palavra pra emocionar quem você ama. 💜",
  "Afinando os instrumentos e aquecendo a voz... 🎤",
  "Misturando os ritmos que você escolheu numa fusão única. 🎚️",
  "Gravando os vocais com todo o carinho. 🎶",
  "Caprichando no refrão pra grudar na cabeça. 🎵",
  "Dando os retoques finais na mixagem... quase lá! ✨",
  "Coisa boa leva tempo, a sua canção está quase pronta. ⏳",
];

const TOTAL_MS = 5 * 60 * 1000; // referência de 5 min
const BAR = "linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)";

/** Tela de espera da música: barra por tempo + mensagens rotativas + cronômetro. */
export function MusicProgress() {
  const [elapsed, setElapsed] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = window.setInterval(() => setElapsed(Date.now() - start), 250);
    const rotate = window.setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      7000,
    );
    return () => {
      window.clearInterval(tick);
      window.clearInterval(rotate);
    };
  }, []);

  // Avança até ~96% ao longo de 5 min; os 100% acontecem quando a prévia chega
  // (a tela troca pelo player).
  const progress = Math.min(96, (elapsed / TOTAL_MS) * 100);
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const clock = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="animate-rise self-stretch rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">Produzindo a sua música 🎧</span>
        <span className="font-mono text-xs text-zinc-400">{clock}</span>
      </div>

      <p key={index} className="animate-rise mt-3 min-h-[44px] text-sm italic leading-relaxed text-zinc-300">
        {MESSAGES[index]}
      </p>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%`, background: BAR }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-300">{Math.round(progress)}%</span>
        <span className="text-zinc-500">Pode levar até 5 minutos ⏳</span>
      </div>

      <p className="mt-5 text-center text-xs text-zinc-500">
        Pode deixar esta tela aberta, assim que ficar pronta, a música aparece aqui
        sozinha. 💜
      </p>
    </div>
  );
}
