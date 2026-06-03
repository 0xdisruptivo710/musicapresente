"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "./drawer";
import { getSongs } from "@/features/quiz/api/quiz-api";
import type { MySongRef } from "../my-songs";

function GalleryItem({ orderId, onNavigate }: { orderId: string; onNavigate: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["order-songs", orderId],
    queryFn: () => getSongs(orderId),
  });
  const song = data?.songs?.[0];
  const ready = (data?.songs.length ?? 0) > 0;

  return (
    <Link
      href={`/oferta/${orderId}`}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/20 text-lg">
        🎵
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-white">
          {song?.title ?? "Sua música"}
        </span>
        <span className="block text-[11px] text-zinc-500">
          {isLoading ? "Carregando…" : ready ? "Pronta para ouvir" : "Em produção…"}
        </span>
      </span>
      <span className="text-zinc-600">›</span>
    </Link>
  );
}

export function GalleryDrawer({
  open,
  onClose,
  songs,
}: {
  open: boolean;
  onClose: () => void;
  songs: MySongRef[];
}) {
  return (
    <Drawer open={open} onClose={onClose} side="right" title="Sua Galeria" subtitle={`${songs.length} música(s)`}>
      {!open ? null : songs.length === 0 ? (
        <div className="mt-8 text-center">
          <div className="text-4xl">🎶</div>
          <p className="mt-3 text-sm text-zinc-400">
            Você ainda não criou nenhuma música. Elas aparecem aqui automaticamente.
          </p>
          <Link
            href="/criar"
            onClick={onClose}
            className="mt-4 inline-block rounded-xl bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/30"
          >
            Criar minha primeira música
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {songs.map((s) => (
            <GalleryItem key={s.orderId} orderId={s.orderId} onNavigate={onClose} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
