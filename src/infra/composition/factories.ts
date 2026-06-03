import 'server-only';
import { getSupabaseAdmin } from '@/infra/db/supabase';
import { SupabaseOrderRepository } from '@/infra/repositories/supabase-order-repository';
import { SupabaseQuizAnswersRepository } from '@/infra/repositories/supabase-quiz-answers-repository';
import { CreateOrderUseCase } from '@/core/use-cases/order/create-order.use-case';
import { GetOrderUseCase } from '@/core/use-cases/order/get-order.use-case';
import { SaveQuizAnswersUseCase } from '@/core/use-cases/order/save-quiz-answers.use-case';
import { CaptureWhatsAppUseCase } from '@/core/use-cases/order/capture-whatsapp.use-case';
import { GenerateLyricsUseCase } from '@/core/use-cases/lyrics/generate-lyrics.use-case';
import { SupabaseLyricsRepository } from '@/infra/repositories/supabase-lyrics-repository';
import { OpenAILyricsGateway } from '@/infra/gateways/openai/openai-lyrics-gateway';
import { TranscribeAudioUseCase } from '@/core/use-cases/transcription/transcribe-audio.use-case';
import { OpenAITranscriptionGateway } from '@/infra/gateways/openai/openai-transcription-gateway';
import { GenerateMusicUseCase } from '@/core/use-cases/music/generate-music.use-case';
import { HandleSunoCallbackUseCase } from '@/core/use-cases/music/handle-suno-callback.use-case';
import { SupabaseSongRepository } from '@/infra/repositories/supabase-song-repository';
import { SunoMusicGateway } from '@/infra/gateways/suno/suno-music-gateway';
import { GetSongsUseCase } from '@/core/use-cases/music/get-songs.use-case';
import { CreatePixChargeUseCase } from '@/core/use-cases/payment/create-pix-charge.use-case';
import { GetPaymentUseCase } from '@/core/use-cases/payment/get-payment.use-case';
import { HandlePaymentWebhookUseCase } from '@/core/use-cases/payment/handle-payment-webhook.use-case';
import { SupabasePaymentRepository } from '@/infra/repositories/supabase-payment-repository';
import { AbacatePayGateway } from '@/infra/gateways/abacatepay/abacatepay-gateway';
import { GetPackagesUseCase } from '@/core/use-cases/package/get-packages.use-case';
import { SupabasePackageRepository } from '@/infra/repositories/supabase-package-repository';
import { GetTributePageBySlugUseCase } from '@/core/use-cases/tribute/get-tribute-page-by-slug.use-case';
import { SupabaseTributePageRepository } from '@/infra/repositories/supabase-tribute-page-repository';
import { env } from '@/shared/config/env';

/**
 * Composition root (CLAUDE.md §3): monta os Use Cases com suas dependências
 * concretas. É o único lugar que conhece infra + core ao mesmo tempo.
 */
function orderRepository() {
  return new SupabaseOrderRepository(getSupabaseAdmin());
}

function quizAnswersRepository() {
  return new SupabaseQuizAnswersRepository(getSupabaseAdmin());
}

function lyricsRepository() {
  return new SupabaseLyricsRepository(getSupabaseAdmin());
}

function lyricsGateway() {
  return new OpenAILyricsGateway();
}

function transcriptionGateway() {
  return new OpenAITranscriptionGateway();
}

function songRepository() {
  return new SupabaseSongRepository(getSupabaseAdmin());
}

function musicGateway() {
  return new SunoMusicGateway();
}

function paymentRepository() {
  return new SupabasePaymentRepository(getSupabaseAdmin());
}

function paymentGateway() {
  return new AbacatePayGateway();
}

function packageRepository() {
  return new SupabasePackageRepository(getSupabaseAdmin());
}

function tributePageRepository() {
  return new SupabaseTributePageRepository(getSupabaseAdmin());
}

export function makeCreateOrderUseCase(): CreateOrderUseCase {
  return new CreateOrderUseCase(orderRepository());
}

export function makeGetOrderUseCase(): GetOrderUseCase {
  return new GetOrderUseCase(orderRepository());
}

export function makeSaveQuizAnswersUseCase(): SaveQuizAnswersUseCase {
  return new SaveQuizAnswersUseCase(orderRepository(), quizAnswersRepository());
}

export function makeCaptureWhatsAppUseCase(): CaptureWhatsAppUseCase {
  return new CaptureWhatsAppUseCase(orderRepository());
}

export function makeGenerateLyricsUseCase(): GenerateLyricsUseCase {
  return new GenerateLyricsUseCase(
    orderRepository(),
    quizAnswersRepository(),
    lyricsRepository(),
    lyricsGateway(),
  );
}

export function makeTranscribeAudioUseCase(): TranscribeAudioUseCase {
  return new TranscribeAudioUseCase(transcriptionGateway());
}

export function makeGenerateMusicUseCase(): GenerateMusicUseCase {
  return new GenerateMusicUseCase(
    orderRepository(),
    lyricsRepository(),
    quizAnswersRepository(),
    musicGateway(),
  );
}

export function makeHandleSunoCallbackUseCase(): HandleSunoCallbackUseCase {
  return new HandleSunoCallbackUseCase(orderRepository(), songRepository());
}

export function makeGetSongsUseCase(): GetSongsUseCase {
  return new GetSongsUseCase(songRepository());
}

export function makeGetPackagesUseCase(): GetPackagesUseCase {
  return new GetPackagesUseCase(packageRepository());
}

export function makeGetTributePageUseCase(): GetTributePageBySlugUseCase {
  return new GetTributePageBySlugUseCase(tributePageRepository(), songRepository());
}

export function makeCreatePixChargeUseCase(): CreatePixChargeUseCase {
  return new CreatePixChargeUseCase(
    orderRepository(),
    paymentRepository(),
    packageRepository(),
    paymentGateway(),
    env.MUSIC_PRICE_CENTS,
  );
}

export function makeGetPaymentUseCase(): GetPaymentUseCase {
  return new GetPaymentUseCase(paymentRepository());
}

export function makeHandlePaymentWebhookUseCase(): HandlePaymentWebhookUseCase {
  return new HandlePaymentWebhookUseCase(orderRepository(), paymentRepository(), songRepository());
}
