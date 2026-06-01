/**
 * Base de todos os erros de domínio (CLAUDE.md §12: erros são classes, nunca
 * string solta). Os Controllers mapeiam `code`/`httpStatus` → resposta HTTP.
 */
export abstract class DomainError extends Error {
  /** Código estável e legível por máquina (ex.: 'ORDER_NOT_FOUND'). */
  abstract readonly code: string;

  /** Status HTTP sugerido ao mapear para a borda. */
  readonly httpStatus: number = 400;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
