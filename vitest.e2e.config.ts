import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Config isolada dos testes de integração (e2e) — tocam o banco Supabase real e
 * exigem `.env.local`. Ficam FORA do `pnpm test` (unit, que roda no CI sem segredos).
 * Rodar com: pnpm test:e2e
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['e2e/**/*.e2e.test.ts'],
    testTimeout: 20000,
  },
});
