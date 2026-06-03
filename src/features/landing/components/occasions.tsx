import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { OCCASIONS } from "../data";

export function Occasions() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-8 flex justify-center">
          <SectionHeading
            center
            tag="Para cada momento"
            title={<>Uma música perfeita para <span className="text-gradient">cada ocasião</span></>}
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OCCASIONS.map((occ, i) => (
            <Reveal key={occ.title} delay={i * 50}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center transition hover:border-violet-400/40 hover:bg-white/[0.05]">
                <span className="text-3xl">{occ.emoji}</span>
                <div className="mt-2 font-semibold text-white">{occ.title}</div>
                <div className="text-xs text-zinc-400">{occ.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
