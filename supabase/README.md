# Supabase — Canção que Encanta

## Decisão de isolamento: schema dedicado `cancao`

O projeto Supabase (`ehlpmukjdknnyhkycncb`, região `sa-east-1`) é **compartilhado** com
vários sistemas em produção (plataforma AIOS, farmácia, `trocas_*`, `x3_*`, etc.) — o
schema `public` tem **centenas de tabelas**, incluindo `tenants`, `customers`, `orders`,
`products` de **outros** produtos.

Para não colidir nem arriscar dados alheios, todo o app vive num **schema dedicado
`cancao`**. O requisito multi-tenant do CLAUDE.md continua válido: cada tabela tem
`tenant_id` mesmo dentro do `cancao`.

## Estrutura

```
supabase/
├── README.md
└── migrations/
    ├── 20260530120000_cancao_init.sql              # schema, enums, helpers, sequence
    ├── 20260530120100_cancao_tables.sql            # tabelas centrais + índices + triggers
    ├── 20260530120200_cancao_rls_grants.sql        # RLS deny-by-default + grants service_role
    └── 20260530120300_cancao_seed_default_tenant.sql  # tenant default + pacotes
```

## Como as migrations são aplicadas

Aplicadas via **Supabase MCP** no Claude Code (`apply_migration`), conforme CLAUDE.md §10.
Estes arquivos são a fonte versionada (espelham o que foi aplicado). **Nunca** altere o
schema "na mão" pelo dashboard sem registrar uma migration aqui.

## Tabelas

`tenants`, `packages`, `customers`, `orders`, `quiz_answers`, `lyrics`, `songs`,
`payments`, `tribute_pages`, `outbox_events`, `processed_webhooks`.

- **Dinheiro em centavos** (`integer`).
- **Máquina de estados** do pedido no enum `cancao.order_status` — transições só em Use Cases.
- **Idempotência** de webhook via `processed_webhooks (provider, event_id)` único.
- **Outbox** (`outbox_events`) emite eventos de domínio para o n8n.

## Tenant default

```
DEFAULT_TENANT_ID=11111111-1111-4111-8111-111111111111
```

## Postura de segurança (RLS)

- RLS **habilitado sem policies** (deny-by-default). O acesso é 100% pelo **backend**
  usando `service_role` (que tem `BYPASSRLS`). Nada exposto via `anon`/`authenticated`.
- O schema `cancao` **não está exposto no PostgREST** (REST/`supabase-js` padrão só
  enxerga `public`). Isso é proposital — o backend acessa via `service_role`.

## Integração com o `supabase-js`

1. ✅ **Schema `cancao` exposto no PostgREST** — feito via
   `alter role authenticator set pgrst.db_schemas = 'public, aesthetic, cancao'`
   (preservando os schemas já expostos) + `notify pgrst, 'reload config'`.
   Validado por `e2e/order.e2e.test.ts` (`pnpm test:e2e`).
2. **Configurar o client** para usar o schema:
   ```ts
   createClient(url, serviceRoleKey, { db: { schema: 'cancao' } })
   ```
3. Se alguma rota pública (ex.: Página VIP) for servir dados direto pelo client com
   `anon`, criar **policies RLS** específicas para isso (hoje: deny-by-default).
