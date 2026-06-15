"use client";

import { AudioPlayer } from "./audio-player";
import { Reveal } from "./reveal";
import { EXAMPLE_TRACKS, REACTION_VIDEO } from "../data";

/** Seção escura "Histórias reais": vídeo de reações + exemplos de música tocáveis. */
export function Stories() {
  return (
    <section
      id="historias"
      className="theme-dark relative mt-10 overflow-hidden rounded-t-[40px] py-20 sm:rounded-t-[64px] sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            Reações reais
          </span>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
            Histórias reais, lágrimas reais
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/60">
            Veja gente de verdade ouvindo a própria história virar música, e escute um exemplo
            completo agora mesmo.
          </p>
        </Reveal>

        {/* Vídeo de reações (montagem) */}
        <Reveal className="mt-10" delay={80}>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-night-2 shadow-2xl">
            <video
              src={REACTION_VIDEO}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              onContextMenu={(e) => e.preventDefault()}
              className="aspect-video w-full bg-black"
            />
          </div>
        </Reveal>

        {/* Exemplos de música completos */}
        <Reveal className="mt-12" delay={120}>
          <h3 className="text-center font-serif text-xl text-white">
            Ouça um exemplo de música completa
          </h3>
          <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
            {EXAMPLE_TRACKS.map((track) => (
              <div key={track.src} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="inline-block rounded bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                  {track.tag}
                </span>
                <div className="mt-2 font-serif text-lg text-white">{track.title}</div>
                <div className="mb-3 text-xs text-white/50">{track.subtitle}</div>
                <AudioPlayer src={track.src} tone="dark" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
