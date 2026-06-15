/** Marca "Música Presente" com nota musical + wordmark serifado. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="currentColor" aria-hidden>
        <path d="M9 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM9 17.5V6l11-2v9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-serif text-lg font-semibold tracking-tight text-ink">
        Música Presente
      </span>
    </div>
  );
}
