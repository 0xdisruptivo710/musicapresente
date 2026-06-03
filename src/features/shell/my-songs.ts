const KEY = "cqe:my-songs";
const EVENT = "cqe:my-songs";

/** Referência local a uma música criada neste dispositivo (sem login). */
export interface MySongRef {
  orderId: string;
  createdAt: number;
}

export function getMySongs(): MySongRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is MySongRef =>
        typeof x === "object" && x !== null && typeof (x as MySongRef).orderId === "string",
    );
  } catch {
    return [];
  }
}

/** Registra um pedido na "galeria" local (idempotente). */
export function addMySong(orderId: string): void {
  if (typeof window === "undefined") return;
  const current = getMySongs();
  if (current.some((s) => s.orderId === orderId)) return;
  const next: MySongRef[] = [{ orderId, createdAt: Date.now() }, ...current];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}
