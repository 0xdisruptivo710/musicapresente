/** Versão da música gerada (V1/V2). Bate com o enum `cancao.song_version`. */
export const SONG_VERSIONS = ['v1', 'v2'] as const;

export type SongVersion = (typeof SONG_VERSIONS)[number];
