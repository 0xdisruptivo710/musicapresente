import { makeTranscribeAudioUseCase } from '@/infra/composition/factories';
import { toErrorResponse } from '@/shared/api/error-response';

/**
 * POST /api/transcribe, recebe um áudio (multipart, campo `audio`) e devolve
 * a transcrição em texto, para preencher a história do quiz.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData();
    const file = form.get('audio');
    if (!(file instanceof File)) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Áudio ausente.' } },
        { status: 400 },
      );
    }

    const result = await makeTranscribeAudioUseCase().execute({
      data: await file.arrayBuffer(),
      filename: file.name || 'audio.webm',
      mimeType: file.type || 'audio/webm',
    });
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
