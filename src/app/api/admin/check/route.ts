import { isAdmin, unauthorized } from '@/shared/admin-auth';

/** GET /api/admin/check, valida a senha do admin (para o login do painel). */
export function GET(request: Request): Response {
  return isAdmin(request) ? Response.json({ ok: true }) : unauthorized();
}
