"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createOrder, generateLyrics, saveQuiz } from "@/features/quiz/api/quiz-api";
import { MAX_GENRES, type OptionItem } from "@/features/quiz/data";
import type { LyricsDTO, QuizPayload } from "@/features/quiz/types";
import type { VoiceGender } from "@/core/domain/value-objects/voice-gender";

export interface QuizSelections {
  category: OptionItem | null;
  moment: OptionItem | null;
  genres: OptionItem[];
  honoreeName: string;
  story: string;
  voiceGender: VoiceGender | null;
}

const EMPTY: QuizSelections = {
  category: null,
  moment: null,
  genres: [],
  honoreeName: "",
  story: "",
  voiceGender: null,
};

/** Total de etapas de coleta (1..5); 6 = música na fila. */
export const TOTAL_STEPS = 5;

function toPayload(s: QuizSelections): QuizPayload {
  return {
    occasionCategory: s.category?.label ?? null,
    occasionMoment: s.moment?.label ?? null,
    genres: s.genres.map((g) => g.label),
    honoreeName: s.honoreeName.trim() || null,
    story: s.story.trim() || null,
    voiceGender: s.voiceGender,
  };
}

/**
 * Estado + persistência do quiz. Cada etapa salva no Order (resiliente a refresh,
 * CLAUDE.md §6). Na etapa 5 dispara a geração da letra (via OpenAI) e permite
 * ajustar/regenerar antes de escolher a voz e criar.
 */
export function useQuiz() {
  const [step, setStep] = useState(1);
  const [selections, setSelectionsState] = useState<QuizSelections>(EMPTY);
  const [lyrics, setLyrics] = useState<LyricsDTO | null>(null);
  const selectionsRef = useRef<QuizSelections>(EMPTY);
  const orderIdRef = useRef<string | null>(null);

  const createMutation = useMutation({ mutationFn: createOrder });
  const saveMutation = useMutation({
    mutationFn: (payload: QuizPayload) => {
      const id = orderIdRef.current;
      if (!id) throw new Error("orderId ausente");
      return saveQuiz(id, payload);
    },
  });
  const lyricsMutation = useMutation({
    mutationFn: (instruction: string | undefined) => {
      const id = orderIdRef.current;
      if (!id) throw new Error("orderId ausente");
      return generateLyrics(id, instruction);
    },
    onSuccess: (data) => setLyrics(data),
  });

  const update = useCallback((patch: Partial<QuizSelections>): QuizSelections => {
    const next = { ...selectionsRef.current, ...patch };
    selectionsRef.current = next;
    setSelectionsState(next);
    return next;
  }, []);

  const persist = useCallback(
    async (next: QuizSelections) => {
      if (!orderIdRef.current) {
        const { orderId } = await createMutation.mutateAsync();
        orderIdRef.current = orderId;
      }
      await saveMutation.mutateAsync(toPayload(next));
    },
    [createMutation, saveMutation],
  );

  const chooseCategory = useCallback(
    (category: OptionItem) => {
      update({ category, moment: null });
      setStep(2);
    },
    [update],
  );

  const chooseMoment = useCallback(
    async (moment: OptionItem) => {
      const next = update({ moment });
      setStep(3);
      await persist(next);
    },
    [update, persist],
  );

  const toggleGenre = useCallback(
    (genre: OptionItem) => {
      const current = selectionsRef.current.genres;
      const exists = current.some((g) => g.value === genre.value);
      if (exists) {
        update({ genres: current.filter((g) => g.value !== genre.value) });
      } else if (current.length < MAX_GENRES) {
        update({ genres: [...current, genre] });
      }
      // já com o máximo selecionado: ignora cliques em novos ritmos
    },
    [update],
  );

  const confirmGenres = useCallback(async () => {
    setStep(4);
    await persist(selectionsRef.current);
  }, [persist]);

  const submitStory = useCallback(
    async (honoreeName: string, story: string) => {
      const next = update({ honoreeName, story });
      setStep(5);
      await persist(next);
      try {
        await lyricsMutation.mutateAsync(undefined);
      } catch {
        // erro disponível em lyricsMutation.error
      }
    },
    [update, persist, lyricsMutation],
  );

  const adjustLyrics = useCallback(
    async (instruction: string) => {
      try {
        await lyricsMutation.mutateAsync(instruction);
      } catch {
        // erro disponível em lyricsMutation.error
      }
    },
    [lyricsMutation],
  );

  const regenerateLyrics = useCallback(async () => {
    try {
      await lyricsMutation.mutateAsync(undefined);
    } catch {
      // erro disponível em lyricsMutation.error
    }
  }, [lyricsMutation]);

  const chooseVoice = useCallback(
    (voiceGender: VoiceGender) => {
      update({ voiceGender });
    },
    [update],
  );

  const finish = useCallback(async () => {
    await persist(selectionsRef.current);
    setStep(6);
  }, [persist]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
  }, []);

  return {
    step,
    selections,
    lyrics,
    lyricsGenerating: lyricsMutation.isPending,
    lyricsError: (lyricsMutation.error ?? null) as Error | null,
    isSaving: createMutation.isPending || saveMutation.isPending,
    error: (saveMutation.error ?? createMutation.error) as Error | null,
    chooseCategory,
    chooseMoment,
    toggleGenre,
    confirmGenres,
    submitStory,
    adjustLyrics,
    regenerateLyrics,
    chooseVoice,
    finish,
    goBack,
  };
}
