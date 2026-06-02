import 'server-only';
import { z } from 'zod';

/**
 * Validação centralizada das variáveis de ambiente do SERVIDOR (CLAUDE.md §13).
 *
 * Importar SOMENTE em código de servidor — o import `server-only` garante que
 * estas chaves nunca vão para o bundle do client (CLAUDE.md §11).
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_DB_SCHEMA: z.string().min(1).default('cancao'),
  SUPABASE_STORAGE_BUCKET_FULL: z.string().min(1).default('songs-full'),
  SUPABASE_STORAGE_BUCKET_PREVIEW: z.string().min(1).default('songs-preview'),

  // App / multi-tenant
  DEFAULT_TENANT_ID: z.uuid(),
  APP_BASE_URL: z.url().optional(),

  // Suno
  SUNO_API_KEY: z.string().optional(),
  SUNO_MODEL: z.string().min(1).default('V4_5PLUS'),
  SUNO_BASE_URL: z.url().default('https://api.sunoapi.org/api/v1'),
  SUNO_CALLBACK_URL: z.url().optional(),

  // OpenAI (geração e ajuste de letra + transcrição de áudio)
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  OPENAI_TRANSCRIBE_MODEL: z.string().min(1).default('whisper-1'),
  OPENAI_BASE_URL: z.url().default('https://api.openai.com/v1'),

  // AbacatePay
  ABACATEPAY_API_KEY: z.string().optional(),
  ABACATEPAY_WEBHOOK_SECRET: z.string().optional(),
  ABACATEPAY_WEBHOOK_URL: z.url().optional(),
  ABACATEPAY_BASE_URL: z.url().default('https://api.abacatepay.com/v2'),

  // Preço da música em centavos
  MUSIC_PRICE_CENTS: z.coerce.number().int().positive().default(3990),

  // Fila (QStash / Inngest)
  QSTASH_TOKEN: z.string().optional(),

  // WhatsApp / n8n
  N8N_WEBHOOK_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // Strings vazias (ex.: `VAR=` no .env) contam como ausentes — assim uma URL
  // opcional vazia não falha em `.url()`.
  const source: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string' && value.length > 0) source[key] = value;
  }

  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }
  return parsed.data;
}

let cached: Env | undefined;
function getEnv(): Env {
  cached ??= loadEnv();
  return cached;
}

/**
 * Env validado de forma LAZY: a validação roda no 1º acesso a `env.*` (runtime),
 * não no import. Assim o `next build` — que importa as rotas sem executá-las —
 * não quebra por variáveis ausentes.
 */
export const env: Env = new Proxy({} as Env, {
  get(_target, prop) {
    return getEnv()[prop as keyof Env];
  },
});
