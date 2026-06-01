-- =============================================================================
-- Canção que Encanta — 0005: URL temporária da Suno em songs
-- A Suno devolve uma audio_url de CDN temporária; guardamos aqui até o pipeline
-- de áudio (Passo 6) re-hospedar e gerar a prévia trimada.
-- =============================================================================

alter table cancao.songs add column if not exists suno_audio_url text;
comment on column cancao.songs.suno_audio_url is
  'URL temporária da CDN da Suno; re-hospedada pelo pipeline de áudio (Passo 6).';
