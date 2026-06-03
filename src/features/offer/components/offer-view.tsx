"use client";

import { useState } from "react";
import Link from "next/link";
import { useOffer } from "../hooks/use-offer";
import { Logo } from "@/features/landing/components/logo";
import { Testimonials } from "@/features/landing/components/testimonials";
import { OfferPaywall } from "./offer-paywall";
import { ValueComparison } from "./value-comparison";
import { PackageSelector } from "./package-selector";
import { OfferFaq } from "./offer-faq";
import { StickyPayBar } from "./sticky-pay-bar";
import { OfferCheckout } from "./offer-checkout";

export function OfferView({ orderId }: { orderId: string }) {
  const offer = useOffer(orderId);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function handlePay(): void {
    offer.startPayment();
    setCheckoutOpen(true);
  }

  return (
    <main className="min-h-dvh pb-28">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#08080c]/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/criar" className="text-xs text-zinc-400 transition hover:text-white">
            ← Voltar
          </Link>
        </div>
      </header>

      <OfferPaywall songs={offer.songs} paid={offer.paid} />

      <section className="py-10">
        <h2 className="mb-1 text-center text-2xl font-bold text-white">
          Reações <span className="text-gradient">reais</span>
        </h2>
        <p className="mb-5 text-center text-sm text-zinc-400">O que dizem nossos clientes</p>
        <div className="mx-auto max-w-5xl">
          <Testimonials />
        </div>
      </section>

      <ValueComparison fromCents={offer.packages[0]?.basePriceCents ?? 6990} />

      <div className="px-4 sm:px-6">
        <a
          href="/vip/exemplo"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto block max-w-md rounded-2xl border border-amber-400/40 bg-amber-400/[0.06] p-4 text-center transition hover:bg-amber-400/[0.1]"
        >
          <div className="text-sm font-bold text-amber-200">🎁 Ver Exemplo de Página VIP</div>
          <div className="mt-0.5 text-xs text-zinc-400">Transforme sua música em um presente ✨</div>
        </a>
      </div>

      {offer.loading ? (
        <p className="py-10 text-center text-sm text-zinc-500">Carregando pacotes…</p>
      ) : (
        <PackageSelector
          packages={offer.packages}
          selectedId={offer.selected?.id ?? null}
          onSelect={offer.selectPackage}
          hasPhotoAddon={offer.hasPhotoAddon}
          extraPhotos={offer.extraPhotos}
          onTogglePhotos={offer.setExtraPhotos}
        />
      )}

      <OfferFaq />

      <StickyPayBar totalCents={offer.totalCents} onPay={handlePay} busy={offer.paymentStarting} />

      <OfferCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        charge={offer.charge}
        paid={offer.paid}
        starting={offer.paymentStarting}
        error={offer.paymentError}
        orderNumber={offer.orderNumber}
      />
    </main>
  );
}
