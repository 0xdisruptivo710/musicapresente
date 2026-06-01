import type {
  AudioInput,
  TranscriptionGateway,
} from '@/core/ports/gateways/transcription-gateway';

export interface TranscribeAudioOutput {
  text: string;
}

/** Transcreve um áudio em texto (usado na etapa de história do quiz). */
export class TranscribeAudioUseCase {
  constructor(private readonly gateway: TranscriptionGateway) {}

  async execute(audio: AudioInput): Promise<TranscribeAudioOutput> {
    const text = await this.gateway.transcribe(audio);
    return { text: text.trim() };
  }
}
