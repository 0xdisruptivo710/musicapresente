import { OCCASIONS } from "../data";

function OccasionSet() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
      {OCCASIONS.map((occ) => (
        <span
          key={occ.title}
          className="flex shrink-0 items-center gap-2 font-serif text-base italic text-ink-soft sm:text-lg"
        >
          <span className="text-xl not-italic">{occ.emoji}</span> {occ.title}
        </span>
      ))}
    </div>
  );
}

/** Marquee horizontal das ocasiões (rola infinitamente). */
export function Occasions() {
  return (
    <section className="py-10">
      <div className="relative w-full overflow-hidden border-y border-hair bg-surface-2/40 py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-page to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-page to-transparent sm:w-32" />
        <div className="flex w-max animate-marquee">
          <OccasionSet />
          <OccasionSet />
        </div>
      </div>
    </section>
  );
}
