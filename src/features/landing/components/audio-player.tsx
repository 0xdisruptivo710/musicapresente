"use client";

import { useRef, useState, type MouseEvent } from "react";

const BARS = 38;

/** Altura determinística das barras da waveform (sem random p/ não quebrar no SSR). */
function barHeight(i: number): number {
  const v = Math.sin(i * 1.3) * Math.cos(i * 0.7);
  return 5 + Math.abs(v) * 17;
}

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Player de áudio com waveform clicável. Toca um por vez (pausa os outros da página). */
export function AudioPlayer({
  src,
  label,
  accent = "violet",
}: {
  src: string;
  label?: string;
  accent?: "violet" | "pink";
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const ratio = dur > 0 ? cur / dur : 0;
  const filled = Math.round(ratio * BARS);
  const fillClass = accent === "pink" ? "bg-pink-400" : "bg-violet-400";

  function toggle(): void {
    const a = ref.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  }

  function seek(e: MouseEvent<HTMLDivElement>): void {
    const a = ref.current;
    if (!a || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const r = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = r * dur;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar" : "Tocar"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition active:scale-95"
        style={{ background: "linear-gradient(135deg,#ec4899,#a855f7)" }}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {label ? <div className="mb-1 truncate text-xs text-zinc-300">{label}</div> : null}
        <div className="flex h-7 cursor-pointer items-center gap-[2px]" onClick={seek}>
          {Array.from({ length: BARS }).map((_, i) => (
            <span
              key={i}
              className={`flex-1 rounded-full transition-colors ${i < filled ? fillClass : "bg-white/15"}`}
              style={{ height: `${barHeight(i)}px` }}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 text-xs tabular-nums text-zinc-400">{fmt(cur)}</div>

      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => {
          document.querySelectorAll("audio").forEach((el) => {
            if (el !== ref.current) el.pause();
          });
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setCur(ref.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDur(ref.current?.duration ?? 0)}
      />
    </div>
  );
}
