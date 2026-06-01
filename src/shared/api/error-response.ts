import { ZodError } from 'zod';
import { DomainError } from '@/core/domain/errors/domain-error';

/**
 * Mapeia erros (domínio / validação / inesperados) → resposta HTTP (CLAUDE.md §12).
 * Controllers ficam finos: try/catch chamando isto.
 */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof DomainError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.httpStatus },
    );
  }

  if (error instanceof ZodError) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Dados inválidos.', issues: error.issues } },
      { status: 400 },
    );
  }

  console.error('[api] erro não tratado:', error);
  // Temporário (diagnóstico): expõe a mensagem real. Voltar a mascarar depois.
  return Response.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor.',
      },
    },
    { status: 500 },
  );
}
