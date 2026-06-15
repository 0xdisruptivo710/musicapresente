import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { STEPS } from "../data";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-10 flex justify-center">
          <SectionHeading
            center
            tag="Processo simples"
            title={
              <>
                Como a <span className="text-gradient">magia acontece</span>
              </>
            }
            sub="Sem precisar saber cantar, tocar ou compor. Só uma história pra contar."
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 60}>
              <div className="relative overflow-hidden rounded-3xl border border-hair bg-white p-6 shadow-sm sm:p-7">
                <span className="pointer-events-none absolute -right-3 -top-8 select-none font-serif text-[140px] font-semibold italic leading-none text-surface">
                  {step.num}
                </span>
                <div className="relative flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-ink">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-ink">
                      {step.emoji} {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.desc}</p>
                    <p className="mt-2 text-sm italic text-brand">{step.emotion}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
