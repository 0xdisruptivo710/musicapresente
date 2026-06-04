"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "O que recebo exatamente após o pagamento?",
    a: "A música completa em alta qualidade, liberada na hora para ouvir e baixar. Nos pacotes com Página VIP, você também recebe o link da homenagem com fotos.",
  },
  {
    q: "Como funciona a Página de Homenagem VIP?",
    a: "É um site só seu, com a música tocando e suas fotos passando. Você recebe um link para abrir no celular e compartilhar com quem quiser.",
  },
  {
    q: "Como recebo o vídeo (Combo Master)?",
    a: "Montamos um vídeo emocional com suas fotos e a música de fundo, pronto para baixar e compartilhar no WhatsApp e Instagram.",
  },
  {
    q: "Quanto tempo demora para ficar pronto?",
    a: "A música é na hora. A Página VIP e o vídeo são combinados com você pelo WhatsApp logo após o pagamento.",
  },
  {
    q: "Por quanto tempo o link da Página VIP fica ativo?",
    a: "Acesso vitalício — o link continua no ar para você reviver a homenagem sempre que quiser.",
  },
];

export function OfferFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 py-12 sm:px-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">
        Dúvidas <span className="text-gradient">frequentes</span>
      </h2>
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-white"
              >
                {faq.q}
                <span className={`shrink-0 text-lg text-amber-300 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
