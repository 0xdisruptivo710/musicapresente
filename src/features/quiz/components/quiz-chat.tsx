"use client";

import { useState } from "react";
import Link from "next/link";
import { TOTAL_STEPS, useQuiz } from "@/features/quiz/hooks/use-quiz";
import { CATEGORIES, GENRES, MAX_GENRES, VOICES } from "@/features/quiz/data";
import type { VoiceGender } from "@/core/domain/value-objects/voice-gender";
import {
  ChoiceCard,
  GradientButton,
  LoadingCard,
  OptionGrid,
  ProgressFooter,
  SystemBubble,
} from "./primitives";
import { AdjustBox, LyricsCard } from "./lyrics-review";
import { AudioRecorder } from "./audio-recorder";
import { MusicPlayer } from "./music-player";
import { MusicProgress } from "./music-progress";

const STEP_LABELS: Record<number, string> = {
  1: "Ocasião",
  2: "Momento",
  3: "Estilos",
  4: "História",
  5: "Letra",
};

export function QuizChat() {
  const quiz = useQuiz();
  const { selections: s, step } = quiz;

  const [name, setName] = useState("");
  const [story, setStory] = useState("");

  const moments =
    CATEGORIES.find((category) => category.value === s.category?.value)?.moments ?? [];

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pb-4 pt-7">
      {step > 1 && step <= TOTAL_STEPS ? (
        <div className="mb-4">
          <button
            type="button"
            onClick={quiz.goBack}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            ← Voltar
          </button>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4">
        <SystemBubble>
          <p>
            Olá! Uma música personalizada é um dos presentes mais emocionantes que
            alguém pode receber. 🎵
          </p>
          <p className="mt-2 text-zinc-400">Vamos montar a sua em 5 passos rápidos.</p>
        </SystemBubble>

        {/* Resumo das escolhas já feitas */}
        {s.category ? (
          <ChoiceCard emoji={s.category.emoji} label={s.category.label} sublabel="Categoria" />
        ) : null}
        {s.moment ? (
          <ChoiceCard emoji={s.moment.emoji} label={s.moment.label} sublabel="Ocasião" />
        ) : null}
        {s.genres.length > 0 && step > 3 ? (
          <ChoiceCard
            emoji="🎶"
            label={s.genres.map((g) => g.label).join(" + ")}
            sublabel="Estilos"
          />
        ) : null}
        {s.honoreeName && step > 4 ? (
          <ChoiceCard emoji="✍️" label={s.honoreeName} sublabel="Homenageado(a)" />
        ) : null}

        {/* Etapa 1 — categoria */}
        {step === 1 ? (
          <>
            <SystemBubble>
              <strong>Para começar:</strong> qual é a ocasião?
            </SystemBubble>
            <OptionGrid options={CATEGORIES} onSelect={quiz.chooseCategory} />
          </>
        ) : null}

        {/* Etapa 2 — momento */}
        {step === 2 ? (
          <>
            <SystemBubble>
              Ótima escolha! Dentro de <strong>{s.category?.label}</strong>, qual é o
              momento exato?
            </SystemBubble>
            <OptionGrid options={moments} onSelect={quiz.chooseMoment} />
          </>
        ) : null}

        {/* Etapa 3 — gêneros (fusão) */}
        {step === 3 ? (
          <>
            <SystemBubble>
              <p>
                🎚️ <strong>Misture os ritmos!</strong>
              </p>
              <p className="mt-1 text-zinc-400">
                Escolha <strong>1 estilo</strong> ou combine <strong>2</strong> para criar uma
                fusão única.
              </p>
            </SystemBubble>
            <OptionGrid
              options={GENRES}
              onSelect={quiz.toggleGenre}
              selectedValues={s.genres.map((g) => g.value)}
              lockUnselected={s.genres.length >= MAX_GENRES}
            />
            {s.genres.length >= MAX_GENRES ? (
              <p className="self-start text-xs text-zinc-500">
                Máximo de {MAX_GENRES} ritmos — desmarque um para trocar.
              </p>
            ) : null}
            <GradientButton
              onClick={quiz.confirmGenres}
              disabled={s.genres.length === 0 || quiz.isSaving}
              className="self-end"
            >
              Continuar ({s.genres.length})
            </GradientButton>
          </>
        ) : null}

        {/* Etapa 4 — história + nome */}
        {step === 4 ? (
          <>
            <SystemBubble>
              Conte a história 💬 — para quem é a música e o que a torna especial?
            </SystemBubble>
            <form
              className="flex flex-col gap-3 self-stretch"
              onSubmit={(event) => {
                event.preventDefault();
                void quiz.submitStory(name, story);
              }}
            >
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome do homenageado(a)"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400"
              />
              <textarea
                value={story}
                onChange={(event) => setStory(event.target.value)}
                rows={5}
                placeholder="Conte a história de vocês, detalhes, apelidos, momentos marcantes... (ou grave um áudio abaixo)"
                className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400"
              />
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-600">
                <span className="h-px flex-1 bg-white/10" />
                ou
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <AudioRecorder
                onTranscribed={(text) =>
                  setStory((prev) => (prev.trim() ? `${prev.trim()}\n${text}` : text))
                }
              />
              <GradientButton
                type="submit"
                disabled={!name.trim() || !story.trim() || quiz.isSaving}
                className="self-end"
              >
                Gerar minha letra
              </GradientButton>
            </form>
          </>
        ) : null}

        {/* Etapa 5 — letra gerada → ajuste → voz → criar */}
        {step === 5 ? (
          quiz.lyricsGenerating && !quiz.lyrics ? (
            <LoadingCard
              title="Criando a sua Letra ✍️"
              subtitle="A IA está lendo a sua história e já pegou um lenço de papel..."
            />
          ) : quiz.lyrics ? (
            <>
              <SystemBubble>
                Sua letra ficou pronta! 💜 Ajuste se quiser, escolha a voz e mande criar.
              </SystemBubble>
              <LyricsCard
                title={quiz.lyrics.title}
                content={quiz.lyrics.content}
                ritmo={s.genres.map((g) => g.label).join(" + ") || null}
                tom={quiz.lyrics.tone}
                ocasiao={s.moment?.label ?? null}
              />
              <AdjustBox
                onAdjust={quiz.adjustLyrics}
                onRegenerate={quiz.regenerateLyrics}
                busy={quiz.lyricsGenerating}
              />
              {quiz.lyricsGenerating ? (
                <p className="self-start text-sm text-zinc-400">Reescrevendo a letra…</p>
              ) : null}
              <SystemBubble>E a voz da música, como você prefere?</SystemBubble>
              <OptionGrid
                options={VOICES}
                columns={2}
                onSelect={(option) => quiz.chooseVoice(option.value as VoiceGender)}
                selectedValues={s.voiceGender ? [s.voiceGender] : []}
              />
              <GradientButton
                onClick={quiz.finish}
                disabled={!s.voiceGender || quiz.isSaving}
                className="self-end"
              >
                🎵 Criar Música
              </GradientButton>
            </>
          ) : (
            <>
              <SystemBubble>
                Não consegui gerar a letra agora.
                {quiz.lyricsError ? ` (${quiz.lyricsError.message})` : ""}
              </SystemBubble>
              <GradientButton onClick={quiz.regenerateLyrics} className="self-end">
                Tentar de novo
              </GradientButton>
            </>
          )
        ) : null}

        {/* Etapa 6 — música: produzindo → player V1/V2 */}
        {step === 6 ? (
          quiz.songs.length > 0 ? (
            <>
              <MusicPlayer songs={quiz.songs} paid={quiz.paid} />
              {quiz.orderId ? (
                <Link
                  href={`/oferta/${quiz.orderId}`}
                  style={{ background: "linear-gradient(90deg,#f97316,#ec4899,#a855f7)" }}
                  className="block w-full rounded-2xl py-3.5 text-center text-sm font-semibold text-white transition hover:opacity-95"
                >
                  🔓 Gostou? Desbloquear minha música
                </Link>
              ) : null}
            </>
          ) : quiz.musicError ? (
            <>
              <SystemBubble>
                Não consegui iniciar a música ({quiz.musicError.message}).
              </SystemBubble>
              <GradientButton onClick={quiz.retryMusic} className="self-end">
                Tentar de novo
              </GradientButton>
            </>
          ) : quiz.musicStatus === "failed" ? (
            <>
              <SystemBubble>A geração da música falhou. Vamos tentar de novo?</SystemBubble>
              <GradientButton onClick={quiz.retryMusic} className="self-end">
                Gerar de novo
              </GradientButton>
            </>
          ) : (
            <MusicProgress />
          )
        ) : null}

        {quiz.error ? (
          <p className="self-start text-sm text-red-400">Ops: {quiz.error.message}</p>
        ) : null}
      </div>

      {step <= TOTAL_STEPS ? (
        <ProgressFooter
          step={step}
          total={TOTAL_STEPS}
          label={STEP_LABELS[step] ?? ""}
          hint={quiz.isSaving ? "Salvando..." : undefined}
        />
      ) : null}
    </main>
  );
}
