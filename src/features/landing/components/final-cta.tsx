import Link from "next/link";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="criar" className="px-4 pb-6 sm:px-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] cta-gradient shadow-[0_30px_60px_-20px_rgba(182,109,91,0.5)] sm:rounded-[48px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="relative flex flex-col items-center px-6 py-20 text-center sm:py-28">
          <div className="mb-8 h-1 w-12 rounded-full bg-white/25" />
          <h2 className="max-w-3xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-medium leading-tight tracking-tight text-white">
            Não diga apenas que ama. <span className="font-light italic">Cante.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] font-light text-white/85 sm:text-[17px]">
            Crie uma música tão única quanto a sua história. Leva menos de 5 minutos, e essa
            lembrança fica para sempre. Ouça antes de pagar.
          </p>
          <Link
            href="/criar"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-ink px-8 py-5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-black hover:shadow-2xl active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="currentColor">
              <path d="M9 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM9 17.5V6l11-2v9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Criar e Ouvir Grátis, Sem Cadastro
          </Link>
          <div className="mt-4 text-sm text-white/70">✓ Só paga se amar. Sem risco nenhum.</div>
        </div>
      </Reveal>
    </section>
  );
}
