import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300">
        🎵 Canção que Encanta
      </span>

      <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
        Transforme a sua história em uma{" "}
        <span className="text-gradient">música inesquecível</span>.
      </h1>

      <p className="mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
        Conte o seu momento especial e a nossa IA compõe uma música personalizada —
        feita só para quem você ama.
      </p>

      <Link
        href="/criar"
        style={{ background: "linear-gradient(90deg,#f97316,#ec4899,#a855f7)" }}
        className="mt-9 inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-semibold text-white transition hover:opacity-95"
      >
        Começar agora →
      </Link>

      <p className="mt-4 text-xs text-zinc-500">
        Ouça uma prévia grátis antes de decidir.
      </p>
    </main>
  );
}
