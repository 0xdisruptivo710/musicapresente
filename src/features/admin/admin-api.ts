const HEADER = "x-admin-password";

async function parse(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export async function checkPassword(password: string): Promise<void> {
  const response = await fetch("/api/admin/check", { headers: { [HEADER]: password } });
  if (!response.ok) throw new Error("Senha inválida.");
}

export async function uploadPhoto(file: File, password: string): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { [HEADER]: password },
    body: form,
  });
  const data = (await parse(response)) as { url?: string; error?: { message?: string } } | null;
  if (!response.ok || !data?.url) {
    throw new Error(data?.error?.message ?? "Falha ao enviar a foto.");
  }
  return { url: data.url };
}

export async function createTribute(
  password: string,
  body: { code: string; honoreeName: string; message: string; signature: string; photos: string[] },
): Promise<{ slug: string }> {
  const response = await fetch("/api/admin/tribute", {
    method: "POST",
    headers: { [HEADER]: password, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await parse(response)) as { slug?: string; error?: { message?: string } } | null;
  if (!response.ok || !data?.slug) {
    throw new Error(data?.error?.message ?? "Falha ao publicar a página.");
  }
  return { slug: data.slug };
}
