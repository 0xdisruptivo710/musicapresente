import Image from "next/image";
import { AudioPlayer } from "./audio-player";
import { CtaButton } from "./cta-button";
import { Reveal } from "./reveal";
import { HERO_AUDIOS, HERO_VIDEO, PROOF_AVATARS } from "../data";

const TRUST = ["Sem cadastro", "Pronta em 5 min", "Ouça antes de pagar"];

export function Hero() {
  return (
    <section className="px-4 pb-12 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Card de vídeo (loop) */}
        <Reveal className="w-full">
          <div className="relative mb-10 w-full overflow-hidden rounded-[28px] border border-white bg-surface shadow-[0_24px_50px_-18px_rgba(58,46,43,0.25)]">
            <div className="relative aspect-video w-full">
              <video
                src={HERO_VIDEO.src}
                poster={HERO_VIDEO.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Reações reais
            </span>
          </div>
        </Reveal>

        <Reveal>
          <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            🎵 Músicas personalizadas com IA
          </span>
          <h1 className="font-serif text-[clamp(2.25rem,6vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-ink">
            Em 5 minutos, uma música{" "}
            <span className="italic text-brand">com o nome de quem você ama</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            <strong className="font-medium text-ink">Sem cantar, sem pagar entrada.</strong> Conte a
            história, a IA compõe e canta com qualidade de estúdio. Você ouve a prévia completa de
            graça e só paga se amar.
          </p>

          <div className="mt-8 flex justify-center">
            <CtaButton size="lg">Criar e Ouvir Grátis Agora →</CtaButton>
          </div>

          <p className="mt-3 font-serif text-[13px] italic text-ink-soft">
            Pronta para ouvir em menos de 5 minutos.
          </p>

          {/* Prova social compacta */}
          <div className="mt-7 flex flex-col items-center gap-2">
            <div className="flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {PROOF_AVATARS.map((src) => (
                  <span
                    key={src}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-page"
                  >
                    <Image src={src} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                ))}
              </div>
              <span className="text-[13px] text-ink-soft">
                <strong className="text-ink">+4.800</strong> famílias emocionadas
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {TRUST.map((t) => (
              <span
                key={t}
                className="rounded-full border border-hair bg-white px-3 py-1 text-xs text-ink-soft"
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Card de depoimento real (Sueli) com os 3 áudios reais */}
        <Reveal delay={120} className="mt-14 w-full">
          <div className="mx-auto max-w-xl rounded-[28px] border border-brand/20 bg-white p-3 text-left shadow-[0_18px_40px_-20px_rgba(58,46,43,0.3)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <Image
                src="/landing/maeefilha.png"
                alt="Mãe e filha emocionadas ouvindo a música personalizada"
                fill
                sizes="(max-width:768px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                💛 Depoimento real
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  S
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">Sueli</div>
                  <div className="text-xs text-ink-soft">🎂 Presente de aniversário para a filha</div>
                </div>
              </div>

              <p className="mt-3 font-serif text-[15px] italic leading-relaxed text-ink">
                “Gente, é afetivo demais. Ouvir a história da minha filha cantada assim resgatou um
                amor que a rotina às vezes esconde. É memorável!”
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {HERO_AUDIOS.map((audio) => (
                  <AudioPlayer key={audio.src} src={audio.src} label={audio.label} tone="light" />
                ))}
              </div>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-soft/70">
                Conteúdo original criado pela cliente, usado com autorização.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
