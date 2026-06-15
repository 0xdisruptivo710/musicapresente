import { CtaButton } from "./cta-button";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const BORING = [
  "🎯 Personalização: baixa ou nenhuma",
  "⚡ Entrega: horas ou dias",
  "♾️ Durabilidade: temporário",
  "💜 Impacto emocional: médio",
];

const PREMIUM = [
  "🎯 Personalização: total, nome, memórias e história real",
  "⚡ Entrega: pronta em 5 minutos",
  "♾️ Durabilidade: memória eterna em alta qualidade",
  "💜 Impacto emocional: inesquecível ★★★★★",
];

export function Comparison() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-10 flex justify-center">
          <SectionHeading
            center
            tag="Por que vale a pena"
            title={
              <>
                A diferença que <span className="text-gradient">você sente</span>
              </>
            }
            sub="O clássico encanto de fazer algo na medida certa."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-hair bg-white/60 p-6">
              <h3 className="text-lg font-semibold text-ink-soft">Presentes comuns</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                {BORING.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-red-400">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative h-full rounded-3xl border border-brand/40 bg-surface p-6 shadow-[0_18px_40px_-20px_rgba(182,109,91,0.5)]">
              <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                ✨ A melhor experiência
              </span>
              <h3 className="font-serif text-lg font-semibold text-ink">Música Presente</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink">
                {PREMIUM.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl border border-brand/20 bg-white p-3 text-center text-sm text-brand">
                A escolha óbvia para quem quer emocionar de verdade.
              </div>
              <CtaButton className="mt-5 w-full">Criar e Ouvir Grátis Agora</CtaButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
