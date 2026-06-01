import { describe, it, expect } from 'vitest';
import { parseSunoCallback } from './suno-callback';

describe('parseSunoCallback', () => {
  it('extrai taskId, sucesso, tipo e faixas (tags como string)', () => {
    const parsed = parseSunoCallback({
      code: 200,
      data: {
        task_id: 'abc',
        callbackType: 'complete',
        data: [
          { id: 'a1', audio_url: 'https://x/a.mp3', duration: 100, tags: 'pop, rap', title: 'A' },
          { id: 'a2', audio_url: 'https://x/b.mp3', duration: 110, tags: ['pop'] },
        ],
      },
    });

    expect(parsed.taskId).toBe('abc');
    expect(parsed.succeeded).toBe(true);
    expect(parsed.callbackType).toBe('complete');
    expect(parsed.tracks).toHaveLength(2);
    expect(parsed.tracks[0]?.tags).toEqual(['pop', 'rap']);
    expect(parsed.tracks[0]?.audioUrl).toBe('https://x/a.mp3');
  });

  it('lida com payload de falha / vazio', () => {
    const parsed = parseSunoCallback({ code: 500, data: {} });
    expect(parsed.succeeded).toBe(false);
    expect(parsed.taskId).toBeNull();
    expect(parsed.tracks).toHaveLength(0);
  });
});
