import { PROOF_STATS } from "../data";
import { Reveal } from "./reveal";

/** Faixa de números (prova social) logo abaixo do hero. */
export function ProofBar() {
  return (
    <div className="px-4 sm:px-6">
      <Reveal className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-4 sm:p-6">
          {PROOF_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-gradient text-2xl font-bold sm:text-3xl">{stat.number}</div>
              <div className="mt-1 text-xs text-zinc-400 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
