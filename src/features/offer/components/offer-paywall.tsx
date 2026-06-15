import { MusicPlayer } from "@/features/quiz/components/music-player";
import type { SongDTO } from "@/features/quiz/types";

/** Topo da oferta: gatilho emocional + prévia V1/V2. */
export function OfferPaywall({ songs, paid }: { songs: SongDTO[]; paid: boolean }) {
  return (
    <section className="px-4 pt-8 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand">
          🔒 Desbloqueio imediato
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Não deixe sua <span className="text-gradient">música se perder.</span>
        </h1>
        <p className="mt-3 text-ink-soft">
          Gostou da prévia? Desbloqueie a versão completa para guardar, compartilhar e emocionar.
        </p>
      </div>

      {songs.length > 0 ? (
        <div className="mx-auto mt-6 max-w-md">
          <MusicPlayer songs={songs} paid={paid} />
        </div>
      ) : null}

      <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-hair bg-white p-4 text-center text-sm italic text-ink-soft">
        “Imagine a expressão no rosto de{" "}
        <strong className="font-semibold not-italic text-ink">quem você ama</strong> ao ouvir seu
        nome nessa música e ver todas essas memórias ganharem vida.”
      </div>
    </section>
  );
}
