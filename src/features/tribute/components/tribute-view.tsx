"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TributePageDTO } from "@/shared/api/tribute-presenter";

const FALLBACK = "/landing/maeefilha.png";

/** Renderiza a Página de Homenagem VIP (fotos + dedicatória + música). */
export function TributeView({ data }: { data: TributePageDTO }) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = data.photos.length > 0 ? data.photos : [FALLBACK];
  const cover = photos[idx] ?? photos[0] ?? FALLBACK;

  useEffect(() => {
    if (!started || photos.length < 2) return;
    const timer = window.setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [started, photos.length]);

  function start(): void {
    setStarted(true);
    audioRef.current?.play().catch(() => {
      // autoplay pode falhar; o clique já é um gesto válido na maioria dos casos
    });
  }

  return (
    <main className="theme-dark relative min-h-dvh overflow-hidden bg-night">
      <div className="absolute inset-0">
        <Image
          key={cover}
          src={cover}
          alt={data.honoreeName ?? "Homenagem"}
          fill
          priority
          sizes="100vw"
          className="animate-rise object-cover"
        />
        <div className="absolute inset-0 bg-night/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-night/30" />
      </div>

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          Homenagem para
        </div>
        <h1
          className="mt-2 font-serif text-3xl font-bold text-white sm:text-5xl"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
        >
          {data.honoreeName ?? data.title ?? "Você"}
        </h1>

        {data.message ? (
          <p className="mt-5 max-w-lg border-l-2 border-brand pl-4 text-left font-serif text-base italic leading-relaxed text-white/90 sm:text-lg">
            “{data.message}”
          </p>
        ) : null}
        {data.signature ? <div className="mt-4 text-sm text-white/70">{data.signature}</div> : null}

        {!started ? (
          <button
            type="button"
            onClick={start}
            className="cta-gradient mt-9 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:opacity-95"
          >
            ▶ Clique para se emocionar
          </button>
        ) : (
          <div className="mt-9 flex items-center gap-2 text-xs text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            {data.audioUrl ? "Tocando a sua música…" : "Reviva cada memória 💜"}
          </div>
        )}

        {started && photos.length > 1 ? (
          <div className="mt-4 flex gap-1.5">
            {photos.map((photo, i) => (
              <span
                key={photo}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-brand" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {data.audioUrl ? <audio ref={audioRef} src={data.audioUrl} loop /> : null}
    </main>
  );
}
