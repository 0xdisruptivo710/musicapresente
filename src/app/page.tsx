import { LandingNav } from "@/features/landing/components/landing-nav";
import { Hero } from "@/features/landing/components/hero";
import { ProofBar } from "@/features/landing/components/proof-bar";
import { Occasions } from "@/features/landing/components/occasions";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { Comparison } from "@/features/landing/components/comparison";
import { Stories } from "@/features/landing/components/stories";
import { Testimonials } from "@/features/landing/components/testimonials";
import { Faq } from "@/features/landing/components/faq";
import { FinalCta } from "@/features/landing/components/final-cta";
import { LandingFooter } from "@/features/landing/components/footer";
import { WhatsappFab } from "@/features/landing/components/whatsapp-fab";
import { Reveal } from "@/features/landing/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <ProofBar />
        <Occasions />
        <HowItWorks />
        <Comparison />
        <Stories />

        {/* Depoimentos reais (prints) */}
        <section className="py-16">
          <div className="mx-auto mb-6 max-w-4xl px-4 sm:px-6">
            <Reveal className="flex justify-center">
              <SectionHeading
                center
                tag="Momentos reais"
                title={
                  <>
                    Lágrimas sinceras de <span className="text-gradient">quem você ama</span>
                  </>
                }
                sub="Reações reais de quem ouviu a própria história sendo cantada."
              />
            </Reveal>
          </div>
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-center text-xs text-ink-soft/70">
              ← deslize para ver os recadinhos →
            </p>
            <Testimonials />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 py-16 sm:px-6">
          <div className="mx-auto mb-8 max-w-2xl">
            <Reveal>
              <SectionHeading
                tag="Dúvidas frequentes"
                title={
                  <>
                    Ainda tem <span className="text-gradient">dúvidas?</span>
                  </>
                }
              />
            </Reveal>
          </div>
          <Faq />
        </section>

        <FinalCta />
      </main>
      <LandingFooter />
      <WhatsappFab />
    </>
  );
}
