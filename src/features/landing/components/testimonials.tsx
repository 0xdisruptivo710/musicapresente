"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TESTIMONIALS } from "../data";

/** Botão compacto que toca o áudio do depoimento (pausa os outros da página). */
function DepoAudioButton({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle(): void {
    const a = ref.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/20"
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
        {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
      </svg>
      {playing ? "Tocando…" : "Ouvir história"}
      <audio
        ref={ref}
        src={src}
        preload="none"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onPlay={() => {
          document.querySelectorAll("audio").forEach((el) => {
            if (el !== ref.current) el.pause();
          });
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </button>
  );
}

/** Carrossel horizontal de prints reais de clientes (com áudio em alguns). */
export function Testimonials() {
  return (
    <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6">
      {TESTIMONIALS.map((t) => (
        <div key={t.image} className="w-[228px] shrink-0 snap-center sm:w-[252px]">
          <div className="overflow-hidden rounded-2xl border border-hair bg-white shadow-sm">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={t.image}
                alt={`Depoimento de cliente, ${t.date}`}
                fill
                sizes="252px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="mt-3 px-1">
            <div className="text-[11px] text-ink-soft/80">🗓 {t.date}</div>
            <div className="mt-1 text-sm leading-snug text-ink">{t.message}</div>
            {t.audio ? <DepoAudioButton src={t.audio} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
