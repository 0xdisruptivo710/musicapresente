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
  "🎯 Personalização: total — nome, memórias e história real",
  "⚡ Entrega: pronta em 5 minutos",
  "♾️ Durabilidade: memória eterna em alta qualidade",
  "💜 Impacto emocional: inesquecível ★★★★★",
];

export function Comparison() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-8 flex justify-center">
          <SectionHeading
            center
            tag="Por que vale a pena"
            title={<>A diferença que <span className="text-gradient">você sente</span></>}
            sub="O clássico encanto de fazer algo na medida certa."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-zinc-400">Presentes comuns</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-400">
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
            <div
              className="relative h-full rounded-2xl border border-amber-500/40 bg-amber-500/[0.06] p-6"
              style={{ boxShadow: "0 0 40px -12px rgba(245,158,11,0.5)" }}
            >
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                ✨ A melhor experiência
              </span>
              <h3 className="text-lg font-semibold text-white">Música Presente</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-200">
                {PREMIUM.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-amber-500/30 bg-black/20 p-3 text-center text-sm text-amber-200">
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
