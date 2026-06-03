import { MusicPlayer } from "@/features/quiz/components/music-player";
import type { SongDTO } from "@/features/quiz/types";

/** Topo da oferta: gatilho emocional + prévia V1/V2. */
export function OfferPaywall({ songs, paid }: { songs: SongDTO[]; paid: boolean }) {
  return (
    <section className="px-4 pt-8 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-300">
          🔒 Desbloqueio imediato
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
          Não deixe sua <span className="text-gradient">música se perder.</span>
        </h1>
        <p className="mt-3 text-zinc-300">
          Gostou da prévia? Desbloqueie a versão completa para guardar, compartilhar e emocionar.
        </p>
      </div>

      {songs.length > 0 ? (
        <div className="mx-auto mt-6 max-w-md">
          <MusicPlayer songs={songs} paid={paid} />
        </div>
      ) : null}

      <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm italic text-zinc-300">
        “Imagine a expressão no rosto de{" "}
        <strong className="font-semibold not-italic text-white">quem você ama</strong> ao ouvir seu
        nome nessa música e ver todas essas memórias ganharem vida.”
      </div>
    </section>
  );
}
