import 'server-only';
import { env } from '@/shared/config/env';

/**
 * Resolve o tenant da requisição. Hoje single-tenant (DEFAULT_TENANT_ID);
 * evoluível para resolver por host/subdomínio quando houver white-label (§3.5).
 */
export function resolveTenantId(): string {
  return env.DEFAULT_TENANT_ID;
}
