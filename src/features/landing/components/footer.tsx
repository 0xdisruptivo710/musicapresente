import { Logo } from "./logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <div className="text-xs text-zinc-500">
          © 2026 Música Presente · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
