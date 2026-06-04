import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { STEPS } from "../data";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-8">
          <SectionHeading
            tag="Como funciona"
            title={<>Sua música personalizada em <span className="text-gradient">5 passos</span></>}
            sub="Sem precisar saber cantar, tocar ou compor. Só uma história pra contar."
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 60}>
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)" }}
                >
                  {step.num}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {step.emoji} {step.title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">{step.desc}</div>
                  <div className="mt-2 text-sm italic text-amber-300/90">{step.emotion}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
