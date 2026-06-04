import type { TributePageDTO } from "@/shared/api/tribute-presenter";

/** Página VIP de exemplo (slug "exemplo"), usada para vender o upsell. */
export const DEMO_TRIBUTE: TributePageDTO = {
  slug: "exemplo",
  title: null,
  honoreeName: "Pai José e Mãe Maria",
  message:
    "Família, obrigado por tudo. Vocês são a razão de quem eu sou. Eu amo vocês para sempre.",
  signature: "Com carinho, Mário",
  photos: ["/landing/maeefilha.png"],
  audioUrl: "/landing/sueli.mp3",
};
