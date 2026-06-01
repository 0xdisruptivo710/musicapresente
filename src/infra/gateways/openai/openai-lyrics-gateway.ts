import 'server-only';
import { env } from '@/shared/config/env';
import type {
  GeneratedLyrics,
  LyricsGateway,
  LyricsGenerationParams,
} from '@/core/ports/gateways/lyrics-gateway';
import { LyricsGenerationError } from '@/core/domain/errors/lyrics-errors';

const SYSTEM_PROMPT = `Você é um compositor brasileiro premiado, especialista em letras emocionantes e personalizadas.

Regras:
- Escreva em português do Brasil.
- Use marcadores de estrutura: [Verso], [Refrão], [Ponte].
- Incorpore o NOME do homenageado e detalhes reais da história contada.
- Combine os gêneros indicados no clima, vocabulário e ritmo da letra.
- 2 a 4 estrofes + um refrão marcante. Emocional e sincero, sem clichê barato.
- Quando houver uma letra anterior e um ajuste pedido, reescreva a partir dela respeitando o pedido.
- Responda SOMENTE com JSON válido, sem texto fora dele:
  {"title": string, "lyrics": string, "tone": string}`;

function voiceLabel(voice: LyricsGenerationParams['voiceGender']): string {
  if (voice === 'm') return 'masculina';
  if (voice === 'f') return 'feminina';
  return 'não definida';
}

function buildUserPrompt(p: LyricsGenerationParams): string {
  const lines = [
    `Ocasião: ${p.occasionCategory ?? '-'} / ${p.occasionMoment ?? '-'}`,
    `Homenageado(a): ${p.honoreeName ?? '-'}`,
    `Gêneros (fusão): ${p.genres.join(', ') || '-'}`,
    `Voz: ${voiceLabel(p.voiceGender)}`,
    `História: ${p.story ?? '-'}`,
  ];
  if (p.previousContent) {
    lines.push('', 'Letra anterior (base para o ajuste):', p.previousContent);
  }
  if (p.instruction) {
    lines.push('', `Ajuste pedido pelo usuário: ${p.instruction}`);
  }
  return lines.join('\n');
}

interface OpenAIChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

/** Geração de letra via OpenAI Chat Completions (JSON mode). */
export class OpenAILyricsGateway implements LyricsGateway {
  async generate(params: LyricsGenerationParams): Promise<GeneratedLyrics> {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new LyricsGenerationError('OPENAI_API_KEY não configurada.');
    }
    const model = env.OPENAI_MODEL;

    let response: Response;
    try {
      response = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.9,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildUserPrompt(params) },
          ],
        }),
      });
    } catch (cause) {
      throw new LyricsGenerationError(`Falha de rede ao chamar a OpenAI: ${String(cause)}`);
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new LyricsGenerationError(
        `OpenAI respondeu ${response.status}: ${detail.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as OpenAIChatResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new LyricsGenerationError('Resposta vazia da OpenAI.');
    }

    let parsed: { title?: unknown; lyrics?: unknown; tone?: unknown };
    try {
      parsed = JSON.parse(content) as typeof parsed;
    } catch {
      throw new LyricsGenerationError('A OpenAI não devolveu JSON válido.');
    }

    const lyrics = typeof parsed.lyrics === 'string' ? parsed.lyrics.trim() : '';
    if (!lyrics) {
      throw new LyricsGenerationError('JSON da OpenAI sem o campo "lyrics".');
    }

    return {
      title: typeof parsed.title === 'string' ? parsed.title : null,
      content: lyrics,
      tone: typeof parsed.tone === 'string' ? parsed.tone : null,
      model,
    };
  }
}
