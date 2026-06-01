import 'server-only';
import { env } from '@/shared/config/env';
import type {
  AudioInput,
  TranscriptionGateway,
} from '@/core/ports/gateways/transcription-gateway';
import { TranscriptionError } from '@/core/domain/errors/transcription-errors';

/** Transcrição de áudio via OpenAI (endpoint /audio/transcriptions). */
export class OpenAITranscriptionGateway implements TranscriptionGateway {
  async transcribe(audio: AudioInput): Promise<string> {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new TranscriptionError('OPENAI_API_KEY não configurada.');
    }

    const form = new FormData();
    form.append('file', new Blob([audio.data], { type: audio.mimeType }), audio.filename);
    form.append('model', env.OPENAI_TRANSCRIBE_MODEL);
    form.append('language', 'pt');

    let response: Response;
    try {
      response = await fetch(`${env.OPENAI_BASE_URL}/audio/transcriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
    } catch (cause) {
      throw new TranscriptionError(`Falha de rede ao transcrever: ${String(cause)}`);
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new TranscriptionError(`OpenAI respondeu ${response.status}: ${detail.slice(0, 200)}`);
    }

    const data = (await response.json()) as { text?: unknown };
    if (typeof data.text !== 'string') {
      throw new TranscriptionError('Resposta de transcrição sem texto.');
    }
    return data.text;
  }
}
