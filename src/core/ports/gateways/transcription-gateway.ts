export interface AudioInput {
  data: ArrayBuffer;
  filename: string;
  mimeType: string;
}

/**
 * Transcrição de áudio em texto (CLAUDE.md §9, fala do usuário contando a
 * história). Implementação atual: OpenAI (Whisper). Trocável por interface.
 */
export interface TranscriptionGateway {
  transcribe(audio: AudioInput): Promise<string>;
}
