import type { ReactNode } from "react";

/** Cabeçalho padrão de seção: tag + título + subtítulo. */
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
      <span className="inline-flex w-fit items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-300">
        {tag}
      </span>
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {sub ? <p className="max-w-md text-sm text-zinc-400 sm:text-base">{sub}</p> : null}
    </div>
  );
}
