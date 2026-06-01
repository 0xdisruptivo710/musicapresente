export interface ApiErrorBody {
  error: { code: string; message: string; issues?: unknown };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Cliente HTTP unificado do frontend (CLAUDE.md §3.6): JSON por padrão e erros
 * normalizados em `ApiError`. Centraliza o tratamento para hooks/TanStack Query.
 */
export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const body = data as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? "Algo deu errado. Tente novamente.",
    );
  }

  return data as T;
}
