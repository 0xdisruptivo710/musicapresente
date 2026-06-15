import type { ReactNode } from "react";

/** Cabeçalho padrão de seção: tag + título serifado + subtítulo. */
export function SectionHeading({
  tag,
  title,
  sub,
  center = false,
}: {
  tag: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">{tag}</span>
      <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub ? <p className="max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">{sub}</p> : null}
    </div>
  );
}
