"use client";

import { useRef, useState } from "react";
import { transcribeAudio } from "@/features/quiz/api/quiz-api";

type RecState = "idle" | "recording" | "transcribing" | "error";

/** Grava a história por áudio e devolve o texto transcrito (OpenAI Whisper). */
export function AudioRecorder({
  onTranscribed,
}: {
  onTranscribed: (text: string) => void;
}) {
  const [state, setState] = useState<RecState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setState("transcribing");
        try {
          const { text } = await transcribeAudio(blob);
          if (text) onTranscribed(text);
          setState("idle");
        } catch (error) {
          setErrorMsg(error instanceof Error ? error.message : "Falha ao transcrever.");
          setState("error");
        }
      };

      recorder.start();
      recorderRef.current = recorder;
      setState("recording");
    } catch {
      setErrorMsg("Não consegui acessar o microfone. Verifique a permissão do navegador.");
      setState("error");
    }
  }

  function stop() {
    recorderRef.current?.stop();
  }

  return (
    <div className="flex flex-col gap-1.5 self-stretch">
      {state === "recording" ? (
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
          Gravando… toque para parar
        </button>
      ) : state === "transcribing" ? (
        <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
          ✍️ Transcrevendo o seu áudio…
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.07]"
        >
          🎤 Contar por áudio
        </button>
      )}
      {errorMsg ? <p className="text-xs text-red-400">{errorMsg}</p> : null}
    </div>
  );
}
