import { CtaButton } from "./cta-button";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="criar" className="relative overflow-hidden px-4 py-20 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(600px 300px at 50% 0%, rgba(168,85,247,0.18), transparent 70%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-300">
          Comece agora
        </span>
        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          Pronto para emocionar com uma <span className="text-gradient">música personalizada?</span>
        </h2>
        <p className="mt-3 text-zinc-400">Pronta em 5 minutos. Ouça antes de pagar.</p>
        <div className="mt-7 flex justify-center">
          <CtaButton size="lg">Criar e Ouvir Grátis — Sem Cadastro</CtaButton>
        </div>
        <div className="mt-4 text-sm text-emerald-300">✓ Só paga se amar. Sem risco nenhum.</div>
      </Reveal>
    </section>
  );
}
