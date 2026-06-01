-- =============================================================================
-- Canção que Encanta — 0001 init
-- Schema dedicado `cancao` (isolamento total do schema `public` compartilhado).
-- Cria: schema, tipos enum, função utilitária de updated_at e sequence de pedido.
-- =============================================================================

create schema if not exists cancao;
comment on schema cancao is
  'App "Canção que Encanta" — músicas personalizadas. Schema isolado do public compartilhado.';

-- ---- Tipos enum -------------------------------------------------------------

-- Máquina de estados do Order (CLAUDE.md §5.2). Transições só dentro de Use Cases.
create type cancao.order_status as enum (
  'draft',
  'quiz_completed',
  'lyrics_generating',
  'lyrics_ready',
  'music_generating',
  'preview_ready',
  'awaiting_payment',
  'paid',
  'delivered',
  'failed',
  'expired',
  'refunded'
);

create type cancao.payment_status as enum (
  'pending',
  'paid',
  'expired',
  'cancelled',
  'refunded',
  'failed'
);

create type cancao.song_version as enum ('v1', 'v2');

create type cancao.voice_gender as enum ('m', 'f');

-- ---- Função utilitária: mantém updated_at em UPDATE -------------------------
create or replace function cancao.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---- Sequence do número público de pedido (ex.: "Pedido #5367") ------------
create sequence if not exists cancao.order_number_seq start with 5001 increment by 1;
