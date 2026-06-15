import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

/** Barra de navegação fixa com a marca, âncoras e o CTA sempre visível. */
export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hair/70 bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-ink-soft md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-ink">
            Como funciona
          </a>
          <a href="#historias" className="transition-colors hover:text-ink">
            Histórias
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            Dúvidas
          </a>
        </nav>
        <CtaButton className="px-4 py-2.5 text-xs sm:text-sm">Criar e Ouvir Grátis</CtaButton>
      </div>
    </header>
  );
}
