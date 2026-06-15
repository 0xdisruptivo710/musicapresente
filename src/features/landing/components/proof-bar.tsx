import { PROOF_STATS } from "../data";
import { Reveal } from "./reveal";

/** Faixa de números (prova social) logo abaixo do hero. */
export function ProofBar() {
  return (
    <div className="px-4 sm:px-6">
      <Reveal className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-hair bg-white p-5 shadow-sm sm:grid-cols-4 sm:p-6">
          {PROOF_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl font-semibold text-brand sm:text-3xl">
                {stat.number}
              </div>
              <div className="mt-1 text-xs text-ink-soft sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
