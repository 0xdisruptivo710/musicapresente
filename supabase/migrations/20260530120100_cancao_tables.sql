-- =============================================================================
-- Canção que Encanta — 0002 tables
-- Tabelas centrais (CLAUDE.md §10). Regras inegociáveis:
--   • tenant_id em TODA tabela de negócio (multi-tenant, sem fallback).
--   • Dinheiro sempre em centavos (integer). Nunca float.
--   • updated_at mantido por trigger cancao.set_updated_at().
-- =============================================================================

-- ---- tenants ----------------------------------------------------------------
create table cancao.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  status      text not null default 'active',
  config      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---- packages (pacotes/preços parametrizáveis — CLAUDE.md §1) ---------------
create table cancao.packages (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              uuid not null references cancao.tenants(id) on delete cascade,
  code                   text not null,
  name                   text not null,
  description            text,
  base_price_cents       integer not null check (base_price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  features               jsonb not null default '[]'::jsonb,
  addons                 jsonb not null default '[]'::jsonb,
  is_active              boolean not null default true,
  sort_order             integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (tenant_id, code)
);
create index idx_packages_tenant_active on cancao.packages (tenant_id, is_active);

-- ---- customers --------------------------------------------------------------
create table cancao.customers (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references cancao.tenants(id) on delete cascade,
  name        text,
  email       text,
  whatsapp    text,
  tax_id      text,                      -- CPF (AbacatePay)
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_customers_tenant_whatsapp on cancao.customers (tenant_id, whatsapp);

-- ---- orders (a sessão do funil; dona do estado) ----------------------------
create table cancao.orders (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references cancao.tenants(id) on delete cascade,
  customer_id      uuid references cancao.customers(id) on delete set null,
  order_number     bigint not null default nextval('cancao.order_number_seq'),
  status           cancao.order_status not null default 'draft',
  package_id       uuid references cancao.packages(id) on delete set null,
  selected_addons  jsonb not null default '[]'::jsonb,
  photo_count      integer,
  whatsapp         text,                 -- capturado antes do pagamento
  amount_cents     integer check (amount_cents >= 0),
  failure_reason   text,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (order_number)
);
create index idx_orders_tenant_status  on cancao.orders (tenant_id, status);
create index idx_orders_tenant_created on cancao.orders (tenant_id, created_at desc);
create index idx_orders_customer       on cancao.orders (customer_id);

-- ---- quiz_answers (1:1 com order) ------------------------------------------
create table cancao.quiz_answers (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references cancao.tenants(id) on delete cascade,
  order_id           uuid not null references cancao.orders(id) on delete cascade,
  occasion_category  text,               -- ex.: "Amor & Casal"
  occasion_moment    text,               -- ex.: "Declaração de Amor"
  genres             text[] not null default '{}',  -- fusão de estilos
  honoree_name       text,
  story              text,
  voice_gender       cancao.voice_gender,
  extra              jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (order_id)
);

-- ---- lyrics -----------------------------------------------------------------
create table cancao.lyrics (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references cancao.tenants(id) on delete cascade,
  order_id    uuid not null references cancao.orders(id) on delete cascade,
  version     integer not null default 1,
  title       text,
  content     text not null,
  tone        text,
  model       text,                      -- LLM/fonte que gerou
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (order_id, version)
);

-- ---- songs (V1/V2 por order) -----------------------------------------------
create table cancao.songs (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references cancao.tenants(id) on delete cascade,
  order_id         uuid not null references cancao.orders(id) on delete cascade,
  version          cancao.song_version not null,
  suno_task_id     text,
  suno_audio_id    text,
  title            text,
  style            text,
  duration_seconds numeric(8,2),
  preview_url      text,                  -- prévia trimada (pública)
  full_path        text,                  -- caminho no bucket privado; signed URL on demand
  image_url        text,
  tags             text[] not null default '{}',
  locked           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (order_id, version)
);
create index idx_songs_suno_task on cancao.songs (suno_task_id);

-- ---- payments ---------------------------------------------------------------
create table cancao.payments (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references cancao.tenants(id) on delete cascade,
  order_id        uuid not null references cancao.orders(id) on delete cascade,
  provider        text not null default 'abacatepay',
  abacatepay_id   text,
  amount_cents    integer not null check (amount_cents >= 0),
  status          cancao.payment_status not null default 'pending',
  method          text,                  -- pix | card
  br_code         text,                  -- PIX copia-e-cola
  br_code_base64  text,                  -- PNG do QR (base64)
  expires_at      timestamptz,
  paid_at         timestamptz,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_payments_tenant_status on cancao.payments (tenant_id, status);
create index idx_payments_abacatepay    on cancao.payments (abacatepay_id);
create index idx_payments_order         on cancao.payments (order_id);

-- ---- tribute_pages (Página VIP pública) ------------------------------------
create table cancao.tribute_pages (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references cancao.tenants(id) on delete cascade,
  order_id      uuid not null references cancao.orders(id) on delete cascade,
  song_id       uuid references cancao.songs(id) on delete set null,
  slug          text not null unique,
  title         text,
  photos        jsonb not null default '[]'::jsonb,  -- [{url, sort}]
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_tribute_tenant on cancao.tribute_pages (tenant_id);

-- ---- outbox_events (Transactional Outbox → n8n; CLAUDE.md §7.4) ------------
create table cancao.outbox_events (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references cancao.tenants(id) on delete cascade,
  aggregate_type  text not null,         -- ex.: 'order'
  aggregate_id    uuid not null,
  event_type      text not null,         -- ex.: 'order.preview_ready'
  payload         jsonb not null default '{}'::jsonb,
  status          text not null default 'pending',  -- pending | dispatched | failed
  attempts        integer not null default 0,
  error           text,
  dispatched_at   timestamptz,
  created_at      timestamptz not null default now()
);
create index idx_outbox_status    on cancao.outbox_events (status, created_at);
create index idx_outbox_aggregate on cancao.outbox_events (aggregate_type, aggregate_id);

-- ---- processed_webhooks (idempotência; CLAUDE.md §9) -----------------------
-- tenant_id nullable: o webhook do provider chega sem tenant; resolvido via order.
create table cancao.processed_webhooks (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid references cancao.tenants(id) on delete cascade,
  provider      text not null,           -- abacatepay | suno
  event_id      text not null,
  event_type    text,
  order_id      uuid references cancao.orders(id) on delete set null,
  payload       jsonb,
  processed_at  timestamptz not null default now(),
  unique (provider, event_id)
);

-- ---- Triggers updated_at ----------------------------------------------------
create trigger trg_tenants_updated_at       before update on cancao.tenants       for each row execute function cancao.set_updated_at();
create trigger trg_packages_updated_at      before update on cancao.packages      for each row execute function cancao.set_updated_at();
create trigger trg_customers_updated_at     before update on cancao.customers     for each row execute function cancao.set_updated_at();
create trigger trg_orders_updated_at        before update on cancao.orders        for each row execute function cancao.set_updated_at();
create trigger trg_quiz_answers_updated_at  before update on cancao.quiz_answers  for each row execute function cancao.set_updated_at();
create trigger trg_lyrics_updated_at        before update on cancao.lyrics        for each row execute function cancao.set_updated_at();
create trigger trg_songs_updated_at         before update on cancao.songs         for each row execute function cancao.set_updated_at();
create trigger trg_payments_updated_at      before update on cancao.payments      for each row execute function cancao.set_updated_at();
create trigger trg_tribute_pages_updated_at before update on cancao.tribute_pages for each row execute function cancao.set_updated_at();
