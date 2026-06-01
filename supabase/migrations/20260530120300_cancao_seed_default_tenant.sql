-- =============================================================================
-- Canção que Encanta — 0004 seed (tenant default + pacotes de referência)
-- O ID do tenant é FIXO e conhecido → use como DEFAULT_TENANT_ID no .env:
--   DEFAULT_TENANT_ID=11111111-1111-4111-8111-111111111111
-- Idempotente (ON CONFLICT DO NOTHING). Preços em centavos, parametrizáveis.
-- =============================================================================

insert into cancao.tenants (id, name, slug, status)
values ('11111111-1111-4111-8111-111111111111', 'Canção que Encanta', 'cancao-que-encanta', 'active')
on conflict (id) do nothing;

insert into cancao.packages
  (tenant_id, code, name, description, base_price_cents, compare_at_price_cents, features, addons, is_active, sort_order)
values
  ('11111111-1111-4111-8111-111111111111', 'music_only',
   'Pacote 1 — Apenas a Música',
   'Arquivo de música personalizado para ouvir no celular.',
   6990, 14990,
   '["Música exclusiva com nome e história de quem você ama","Liberada para baixar e ouvir no celular","Não inclui fotos nem vídeo"]'::jsonb,
   '[]'::jsonb,
   true, 1),
  ('11111111-1111-4111-8111-111111111111', 'music_site',
   'Pacote 2 — Música + Site (Página VIP)',
   'Sua música + um link de site com fotos para ver no celular.',
   8990, 15990,
   '["Tudo do Pacote 1","Página de Homenagem VIP com fotos","Acesso vitalício"]'::jsonb,
   '[{"code":"photos_5","name":"5 fotos","price_cents":0,"default":true},{"code":"photos_20","name":"20 fotos","price_cents":1000}]'::jsonb,
   true, 2),
  ('11111111-1111-4111-8111-111111111111', 'combo_master',
   'Pacote 3 — Combo Master (Vídeo)',
   'A homenagem completa em formato de vídeo com fotos e música de fundo.',
   10990, 19990,
   '["Tudo dos Pacotes 1 e 2","Vídeo emocional com suas fotos e a música tocando","Pronto para baixar e compartilhar no WhatsApp/Instagram"]'::jsonb,
   '[{"code":"photos_5","name":"5 fotos","price_cents":0,"default":true},{"code":"photos_20","name":"20 fotos","price_cents":1000}]'::jsonb,
   true, 3)
on conflict (tenant_id, code) do nothing;
