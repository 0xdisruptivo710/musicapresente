import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/shared/config/env';
import type { Database } from './database.types';

/** Cliente Supabase tipado e fixado no schema `cancao`. */
export type CancaoClient = SupabaseClient<Database, 'cancao'>;

let cached: CancaoClient | undefined;

/**
 * Cliente Supabase do BACKEND usando a `service_role` (que tem BYPASSRLS),
 * fixado no schema dedicado `cancao` (isolado do `public` compartilhado).
 *
 * Toda a persistência deve passar por Repositories (CLAUDE.md §3). NUNCA usar
 * este cliente em componentes/código de client, ele carrega a service role key.
 */
export function getSupabaseAdmin(): CancaoClient {
  if (cached) return cached;
  cached = createClient<Database, 'cancao'>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      db: { schema: 'cancao' },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  return cached;
}
