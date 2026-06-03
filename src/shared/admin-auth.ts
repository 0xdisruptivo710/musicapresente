/**
 * Autenticação simples do mini-admin: compara o header `x-admin-password` com
 * a env `ADMIN_PASSWORD`. Sem a env configurada, o admin fica desabilitado.
 */
export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return request.headers.get('x-admin-password') === expected;
}

export function unauthorized(): Response {
  return Response.json(
    { error: { code: 'UNAUTHORIZED', message: 'Senha de admin inválida.' } },
    { status: 401 },
  );
}
