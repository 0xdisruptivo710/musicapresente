-- =============================================================================
-- Canção que Encanta — 0003 RLS + grants
-- Acesso ao banco é 100% pelo backend via service_role (que tem BYPASSRLS).
-- Habilitar RLS sem policies = deny-by-default para anon/authenticated.
-- OBS: o schema `cancao` ainda NÃO está exposto no PostgREST (ver supabase/README.md).
-- =============================================================================

-- ---- Grants para o backend (service_role) ----------------------------------
grant usage on schema cancao to service_role;
grant all privileges on all tables    in schema cancao to service_role;
grant all privileges on all sequences in schema cancao to service_role;
grant all privileges on all functions in schema cancao to service_role;

alter default privileges in schema cancao grant all on tables    to service_role;
alter default privileges in schema cancao grant all on sequences to service_role;
alter default privileges in schema cancao grant all on functions to service_role;

-- ---- RLS deny-by-default (hardening) ---------------------------------------
alter table cancao.tenants            enable row level security;
alter table cancao.packages           enable row level security;
alter table cancao.customers          enable row level security;
alter table cancao.orders             enable row level security;
alter table cancao.quiz_answers       enable row level security;
alter table cancao.lyrics             enable row level security;
alter table cancao.songs              enable row level security;
alter table cancao.payments           enable row level security;
alter table cancao.tribute_pages      enable row level security;
alter table cancao.outbox_events      enable row level security;
alter table cancao.processed_webhooks enable row level security;
