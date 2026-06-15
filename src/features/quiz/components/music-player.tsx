"use client";

import { useState } from "react";
import type { SongDTO } from "@/features/quiz/types";

/** Player de prévia com alternância V1/V2. O CTA de compra vive no PaymentPanel. */
export function MusicPlayer({ songs, paid = false }: { songs: SongDTO[]; paid?: boolean }) {
  const [active, setActive] = useState(0);
  const current = songs[active] ?? songs[0];
  if (!current) return null;

  return (
    <div className="animate-rise self-stretch rounded-2xl border border-brand/30 bg-white p-5 shadow-sm">
      <div className="text-center text-[11px] font-semibold uppercase tracking-widest text-brand">
        Sua música ficou pronta 🎉
      </div>
      {current.title ? (
        <div className="mt-1 text-center font-serif text-lg font-semibold text-ink">{current.title}</div>
      ) : null}

      {songs.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          {songs.map((song, index) => (
            <button
              key={song.id}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
                index === active
                  ? "border border-brand bg-brand/15 text-brand"
                  : "border border-hair bg-white text-ink-soft hover:bg-surface/40"
              }`}
            >
              {song.version.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}

      {/* key força recarregar o player ao trocar de versão.
          controlsList=nodownload + bloqueio do menu de contexto impedem baixar a prévia. */}
      <audio
        key={current.id}
        controls
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        src={current.audioUrl ?? undefined}
        className="mt-4 w-full"
      />

      <p className="mt-3 text-center text-xs text-ink-soft">
        {paid
          ? "🔓 Música completa liberada, aproveite!"
          : "Prévia, desbloqueie a versão completa logo abaixo."}
      </p>
    </div>
  );
}
