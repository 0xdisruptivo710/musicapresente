import { formatBRL } from "@/shared/format";

interface CompareItem {
  emoji: string;
  name: string;
  priceLabel: string;
  life: string;
  highlight: boolean;
}

/** Ancoragem de preço: compara a música com gastos comuns. */
export function ValueComparison({ fromCents }: { fromCents: number }) {
  const items: CompareItem[] = [
    { emoji: "💐", name: "Buquê de flores", priceLabel: formatBRL(18000), life: "Dura 5 dias", highlight: false },
    { emoji: "🍽️", name: "Jantar especial", priceLabel: formatBRL(25000), life: "Dura 1 noite", highlight: false },
    {
      emoji: "✨",
      name: "Sua Música VIP",
      priceLabel: `A partir de ${formatBRL(fromCents)}`,
      life: "Para a vida toda",
      highlight: true,
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          A diferença entre um presente <span className="text-zinc-400">comum</span> e um{" "}
          <span className="text-gradient">eterno.</span>
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Compare o investimento emocional da sua música com escolhas do dia a dia.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.name}
              className={`rounded-2xl border p-5 text-center ${
                it.highlight
                  ? "border-amber-500/40 bg-amber-500/[0.06]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="text-3xl">{it.emoji}</div>
              <div className={`mt-2 text-sm font-semibold ${it.highlight ? "text-white" : "text-zinc-300"}`}>
                {it.name}
              </div>
              <div className={`mt-1 text-sm ${it.highlight ? "text-amber-300" : "text-zinc-500"}`}>
                {it.priceLabel}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-wider text-zinc-500">{it.life}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
