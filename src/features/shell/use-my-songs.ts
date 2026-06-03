"use client";

import { useEffect, useState } from "react";
import { getMySongs, type MySongRef } from "./my-songs";

/** Lê as músicas locais e reage a novas criações (evento + storage). */
export function useMySongs(): MySongRef[] {
  const [songs, setSongs] = useState<MySongRef[]>([]);

  useEffect(() => {
    const read = () => setSongs(getMySongs());
    read();
    window.addEventListener("cqe:my-songs", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("cqe:my-songs", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return songs;
}
