"use client";

import { useState } from "react";
import { checkPassword, createTribute, uploadPhoto } from "../admin-api";

const INPUT =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400";
const LABEL = "block text-[11px] uppercase tracking-widest text-zinc-500";

export function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const [code, setCode] = useState("");
  const [honoreeName, setHonoreeName] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function login(): Promise<void> {
    setChecking(true);
    setAuthErr(null);
    try {
      await checkPassword(password);
      setAuthed(true);
    } catch (e) {
      setAuthErr(e instanceof Error ? e.message : "Senha inválida.");
    } finally {
      setChecking(false);
    }
  }

  async function onFiles(files: FileList | null): Promise<void> {
    if (!files) return;
    setUploading(true);
    setErr(null);
    try {
      for (const file of Array.from(files)) {
        const { url } = await uploadPhoto(file, password);
        setPhotos((prev) => [...prev, url]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function publish(): Promise<void> {
    setPublishing(true);
    setErr(null);
    try {
      const result = await createTribute(password, { code, honoreeName, message, signature, photos });
      setSlug(result.slug);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao publicar.");
    } finally {
      setPublishing(false);
    }
  }

  // 1) Login
  if (!authed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
        <h1 className="text-xl font-bold text-white">Painel admin</h1>
        <p className="mt-1 text-sm text-zinc-400">Criação de Páginas VIP</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && password && void login()}
          placeholder="Senha"
          className={`mt-4 ${INPUT}`}
        />
        {authErr ? <p className="mt-1 text-xs text-red-400">{authErr}</p> : null}
        <button
          type="button"
          onClick={() => void login()}
          disabled={checking || !password}
          style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
          className="mt-3 rounded-2xl py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {checking ? "Entrando…" : "Entrar"}
        </button>
      </main>
    );
  }

  // 2) Resultado
  if (slug) {
    const path = `/vip/${slug}`;
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-2 text-xl font-bold text-white">Página publicada!</h1>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 break-all rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200"
        >
          {path}
        </a>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(`${window.location.origin}${path}`)}
          className="mt-3 rounded-2xl border border-white/15 py-3 text-sm font-semibold text-white hover:bg-white/5"
        >
          Copiar link completo
        </button>
        <button
          type="button"
          onClick={() => {
            setSlug(null);
            setCode("");
            setHonoreeName("");
            setMessage("");
            setSignature("");
            setPhotos([]);
          }}
          className="mt-3 text-sm text-zinc-400 hover:text-white"
        >
          Criar outra
        </button>
      </main>
    );
  }

  // 3) Formulário
  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="text-xl font-bold text-white">Criar Página VIP</h1>
      <div className="mt-5 flex flex-col gap-3">
        <div>
          <label className={LABEL}>Código do pedido</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="005017"
            inputMode="numeric"
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className={LABEL}>Nome do homenageado</label>
          <input
            value={honoreeName}
            onChange={(e) => setHonoreeName(e.target.value)}
            placeholder="Pai José e Mãe Maria"
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className={LABEL}>Dedicatória</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Família, obrigado por tudo…"
            className={`mt-1 resize-none ${INPUT}`}
          />
        </div>
        <div>
          <label className={LABEL}>Assinatura</label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Com carinho, Mário"
            className={`mt-1 ${INPUT}`}
          />
        </div>
        <div>
          <label className={LABEL}>Fotos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => void onFiles(e.target.files)}
            className="mt-1 block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500/20 file:px-3 file:py-2 file:text-violet-200"
          />
          {uploading ? <p className="mt-1 text-xs text-zinc-400">Enviando fotos…</p> : null}
          {photos.length > 0 ? (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photos.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element -- preview de upload
                <img key={url} src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          ) : null}
        </div>

        {err ? <p className="text-sm text-red-400">{err}</p> : null}

        <button
          type="button"
          onClick={() => void publish()}
          disabled={publishing || !code || !honoreeName}
          style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
          className="mt-2 rounded-2xl py-3.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {publishing ? "Publicando…" : "Publicar página VIP"}
        </button>
      </div>
    </main>
  );
}
