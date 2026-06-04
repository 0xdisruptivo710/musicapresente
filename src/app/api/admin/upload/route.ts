import { isAdmin, unauthorized } from '@/shared/admin-auth';
import { getSupabaseAdmin } from '@/infra/db/supabase';
import { toErrorResponse } from '@/shared/api/error-response';

const BUCKET = 'vip-photos';

/** POST /api/admin/upload, sobe uma foto da Página VIP e devolve a URL pública. */
export async function POST(request: Request): Promise<Response> {
  if (!isAdmin(request)) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return Response.json(
        { error: { code: 'NO_FILE', message: 'Nenhum arquivo enviado.' } },
        { status: 400 },
      );
    }

    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${crypto.randomUUID()}.${ext || 'jpg'}`;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (error) {
      return Response.json(
        { error: { code: 'UPLOAD_FAILED', message: error.message } },
        { status: 502 },
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return Response.json({ url: data.publicUrl }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
