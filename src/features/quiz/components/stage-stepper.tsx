import { Fragment } from "react";

type Stage = "details" | "lyrics" | "music";

const STAGES: { key: Stage; label: string }[] = [
  { key: "details", label: "Detalhes" },
  { key: "lyrics", label: "Letra" },
  { key: "music", label: "Música" },
];

/** Indicador visual das 3 fases (Detalhes → Letra → Música). */
export function StageStepper({ current }: { current: Stage }) {
  const currentIdx = STAGES.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-1 self-stretch py-1">
      {STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <Fragment key={stage.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-emerald-600 text-white"
                    : active
                      ? "bg-brand text-white"
                      : "border border-hair text-ink-soft"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  active ? "text-ink" : done ? "text-emerald-600" : "text-ink-soft"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 ? (
              <div className={`mb-4 h-px w-8 ${i < currentIdx ? "bg-emerald-600" : "bg-hair"}`} />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
