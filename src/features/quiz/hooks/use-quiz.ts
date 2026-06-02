"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  createPayment,
  generateLyrics,
  generateMusic,
  getOrder,
  getPayment,
  getSongs,
  saveQuiz,
} from "@/features/quiz/api/quiz-api";
import { MAX_GENRES, type OptionItem } from "@/features/quiz/data";
import type { LyricsDTO, PixChargeDTO, QuizPayload } from "@/features/quiz/types";
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

/** Total de etapas de coleta (1..5); 6 = música. */
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
 * Estado + persistência do quiz. Etapas 1-4 coletam e salvam; a 5 gera/ajusta a
 * letra; ao "Criar Música" dispara a Suno e faz polling até a prévia ficar pronta.
 */
export function useQuiz() {
  const [step, setStep] = useState(1);
  const [selections, setSelectionsState] = useState<QuizSelections>(EMPTY);
  const [lyrics, setLyrics] = useState<LyricsDTO | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [charge, setCharge] = useState<PixChargeDTO | null>(null);
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
  const musicMutation = useMutation({
    mutationFn: (id: string) => generateMusic(id),
  });

  // Polling do estado do pedido enquanto a música é produzida.
  const orderStatusQuery = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => getOrder(orderId as string),
    enabled: musicStarted && orderId !== null && step === 6,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "preview_ready" || status === "failed" ? false : 5000;
    },
  });

  const songsQuery = useQuery({
    queryKey: ["order-songs", orderId],
    queryFn: () => getSongs(orderId as string),
    enabled: orderStatusQuery.data?.status === "preview_ready" && orderId !== null,
  });

  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: (id: string) => createPayment(id),
    onSuccess: (data) => setCharge(data),
  });

  // Polling do status da cobrança até confirmar o pagamento.
  const paymentStatusQuery = useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPayment(orderId as string),
    enabled: charge !== null && orderId !== null,
    refetchInterval: (query) =>
      query.state.data?.payment?.status === "paid" ? false : 4000,
  });

  const paid = paymentStatusQuery.data?.payment?.status === "paid";

  // Pagamento confirmado → recarrega as músicas (agora desbloqueadas).
  useEffect(() => {
    if (paid && orderId) {
      void queryClient.invalidateQueries({ queryKey: ["order-songs", orderId] });
    }
  }, [paid, orderId, queryClient]);

  const update = useCallback((patch: Partial<QuizSelections>): QuizSelections => {
    const next = { ...selectionsRef.current, ...patch };
    selectionsRef.current = next;
    setSelectionsState(next);
    return next;
  }, []);

  const persist = useCallback(
    async (next: QuizSelections) => {
      if (!orderIdRef.current) {
        const { orderId: id } = await createMutation.mutateAsync();
        orderIdRef.current = id;
        setOrderId(id);
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

  const startMusic = useCallback(async () => {
    const id = orderIdRef.current;
    if (!id) return;
    try {
      await musicMutation.mutateAsync(id);
      setMusicStarted(true);
    } catch {
      // erro disponível em musicMutation.error
    }
  }, [musicMutation]);

  const startPayment = useCallback(async () => {
    const id = orderIdRef.current;
    if (!id) return;
    try {
      await paymentMutation.mutateAsync(id);
    } catch {
      // erro disponível em paymentMutation.error
    }
  }, [paymentMutation]);

  const finish = useCallback(async () => {
    await persist(selectionsRef.current);
    setStep(6);
    await startMusic();
  }, [persist, startMusic]);

  const retryMusic = useCallback(async () => {
    await startMusic();
  }, [startMusic]);

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
    musicStarting: musicMutation.isPending,
    musicStatus: orderStatusQuery.data?.status ?? null,
    musicError: (musicMutation.error ?? null) as Error | null,
    songs: songsQuery.data?.songs ?? [],
    orderNumber: orderStatusQuery.data?.orderNumber ?? null,
    charge,
    paid,
    paymentStarting: paymentMutation.isPending,
    paymentError: (paymentMutation.error ?? null) as Error | null,
    startPayment,
    chooseCategory,
    chooseMoment,
    toggleGenre,
    confirmGenres,
    submitStory,
    adjustLyrics,
    regenerateLyrics,
    chooseVoice,
    finish,
    retryMusic,
    goBack,
  };
}
