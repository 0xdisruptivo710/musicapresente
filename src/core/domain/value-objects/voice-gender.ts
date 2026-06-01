/** Voz da música (CLAUDE.md §6). Bate com o enum `cancao.voice_gender`. */
export const VOICE_GENDERS = ['m', 'f'] as const;

export type VoiceGender = (typeof VOICE_GENDERS)[number];

export function isVoiceGender(value: unknown): value is VoiceGender {
  return value === 'm' || value === 'f';
}
