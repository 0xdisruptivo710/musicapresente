import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

/** Barra de navegação fixa com a marca e o CTA sempre visível. */
export function LandingNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#100a0a]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <CtaButton className="px-4 py-2.5 text-xs sm:text-sm">Criar e Ouvir Grátis</CtaButton>
      </div>
    </nav>
  );
}
