import Image from "next/image";
import { AudioPlayer } from "./audio-player";
import { CtaButton } from "./cta-button";
import { Reveal } from "./reveal";
import { HERO_AUDIOS } from "../data";

const TRUST = ["Sem cadastro", "Pronta em 5 min", "Ouça antes de pagar"];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Copy + CTA */}
        <Reveal>
          <div className="flex flex-col">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
              🎵 Música personalizada feita por IA
            </span>
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              Em 5 minutos você cria uma música{" "}
              <span className="text-gradient">com o nome de quem você ama</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base text-zinc-300 sm:text-lg">
              <strong className="text-white">Sem cantar, sem pagar entrada.</strong> Ouça a prévia
              completa de graça — a música fica pronta na hora, com a história e os detalhes que só
              você sabe.
            </p>
            <div className="mt-7">
              <CtaButton size="lg">Criar e Ouvir Grátis Agora →</CtaButton>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {TRUST.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Card de depoimento real (Sueli) */}
        <Reveal delay={120}>
          <div className="rounded-3xl border border-violet-500/20 bg-white/[0.03] p-3 shadow-2xl shadow-violet-900/30">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <Image
                src="/landing/maeefilha.png"
                alt="Mãe e filha emocionadas ouvindo a música personalizada"
                fill
                priority
                sizes="(max-width:768px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Depoimento real
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-600 text-sm font-bold text-white">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-white">
                    Sueli
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-400" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <div className="text-xs text-zinc-400">🎂 Presente de aniversário para a filha</div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-200">
                “Gente, é afetivo demais. Ouvir a história da minha filha cantada assim resgatou um
                amor que a rotina às vezes esconde. É memorável!”
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {HERO_AUDIOS.map((audio, i) => (
                  <AudioPlayer
                    key={audio.src}
                    src={audio.src}
                    label={audio.label}
                    accent={i === HERO_AUDIOS.length - 1 ? "violet" : "pink"}
                  />
                ))}
              </div>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-600">
                Conteúdo original criado pela cliente, usado com autorização.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
