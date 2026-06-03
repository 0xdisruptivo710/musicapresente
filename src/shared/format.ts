/** Formata centavos (inteiro) como moeda BRL. CLAUDE.md §5.1 — dinheiro em centavos. */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
