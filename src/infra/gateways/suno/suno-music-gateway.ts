import 'server-only';
import { env } from '@/shared/config/env';
import type {
  GenerateMusicParams,
  MusicGateway,
  MusicStatusResult,
} from '@/core/ports/gateways/music-gateway';
import { MusicGenerationError } from '@/core/domain/errors/music-errors';
import { normalizeStatus, normalizeTracks } from './suno-normalize';

/** Geração de música via Suno API (https://api.sunoapi.org/api/v1), assíncrona. */
export class SunoMusicGateway implements MusicGateway {
  async generate(params: GenerateMusicParams): Promise<{ taskId: string }> {
    const apiKey = env.SUNO_API_KEY;
    if (!apiKey) {
      throw new MusicGenerationError('SUNO_API_KEY não configurada.');
    }
    if (!env.SUNO_CALLBACK_URL) {
      throw new MusicGenerationError('SUNO_CALLBACK_URL não configurada (defina após o deploy).');
    }

    const body: Record<string, unknown> = {
      prompt: params.lyrics.slice(0, 5000),
      customMode: true,
      instrumental: false,
      style: params.style.slice(0, 1000),
      title: params.title.slice(0, 100),
      model: env.SUNO_MODEL,
      callBackUrl: env.SUNO_CALLBACK_URL,
    };
    if (params.vocalGender) {
      body.vocalGender = params.vocalGender;
    }

    let response: Response;
    try {
      response = await fetch(`${env.SUNO_BASE_URL}/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (cause) {
      throw new MusicGenerationError(`Falha de rede ao chamar a Suno: ${String(cause)}`);
    }

    const data = (await response.json().catch(() => null)) as {
      code?: number;
      msg?: string;
      data?: { taskId?: unknown };
    } | null;

    if (!response.ok || data?.code !== 200) {
      throw new MusicGenerationError(`Suno respondeu ${response.status}: ${data?.msg ?? 'erro'}`);
    }
    const taskId = data.data?.taskId;
    if (typeof taskId !== 'string' || !taskId) {
      throw new MusicGenerationError('Suno não devolveu taskId.');
    }
    return { taskId };
  }

  async getStatus(taskId: string): Promise<MusicStatusResult> {
    const apiKey = env.SUNO_API_KEY;
    if (!apiKey) {
      throw new MusicGenerationError('SUNO_API_KEY não configurada.');
    }

    let response: Response;
    try {
      response = await fetch(
        `${env.SUNO_BASE_URL}/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
    } catch (cause) {
      throw new MusicGenerationError(`Falha de rede ao consultar a Suno: ${String(cause)}`);
    }

    const data = (await response.json().catch(() => null)) as {
      code?: number;
      data?: { status?: unknown; response?: { data?: unknown } };
    } | null;

    if (!response.ok || data?.code !== 200) {
      throw new MusicGenerationError(`Suno (status) respondeu ${response.status}.`);
    }
    return {
      status: normalizeStatus(data.data?.status),
      tracks: normalizeTracks(data.data?.response?.data),
    };
  }
}
