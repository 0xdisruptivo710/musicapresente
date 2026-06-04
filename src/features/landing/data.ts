/** Conteúdo da landing (copy + provas sociais). Fácil de editar sem mexer na UI. */

export interface HeroAudio {
  src: string;
  label: string;
}

/** Áudios do card de depoimento da Sueli no hero (assets em /public/landing). */
export const HERO_AUDIOS: HeroAudio[] = [
  { src: "/landing/audio-demo-01.ogg", label: "🎤 Reação dela ao ouvir, parte 1" },
  { src: "/landing/audio-demo-02.ogg", label: "🎤 Reação dela ao ouvir, parte 2" },
  { src: "/landing/sueli.mp3", label: "🎵 A música completa da filha da Sueli" },
];

export interface ProofStat {
  number: string;
  label: string;
}

/** Números de prova social, ajuste para refletir a realidade do seu negócio. */
export const PROOF_STATS: ProofStat[] = [
  { number: "+4.800", label: "músicas criadas" },
  { number: "4,9★", label: "avaliação média" },
  { number: "5 min", label: "pronta na hora" },
  { number: "100%", label: "ouça antes de pagar" },
];

export interface Testimonial {
  image: string;
  date: string;
  message: string;
  audio?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    image: "/landing/depoimento1.jpg",
    date: "19 de março de 2026",
    message: "Imagina, amei demais ❤️ Estou encantada!",
    audio: "/landing/depoimento1.mp3",
  },
  {
    image: "/landing/depoimento2.jpg",
    date: "17 de março de 2026",
    message: "Fiz surpresa para uma amiga. Ela amou!",
    audio: "/landing/depoimento2.mp3",
  },
  {
    image: "/landing/depoimento3.jpg",
    date: "20 de março de 2026",
    message: "Ai, eu amei! Muito obrigada! 😍😭",
  },
  {
    image: "/landing/depoimento4.jpg",
    date: "Março de 2026",
    message: "Ficou lindo demais! Ela vai chorar muito!",
    audio: "/landing/depoimento4.mp3",
  },
  {
    image: "/landing/depoimento5.jpg",
    date: "Março de 2026",
    message: "Que presente único e emocionante! 💜",
  },
  {
    image: "/landing/depoimento6.jpg",
    date: "Março de 2026",
    message: "Todos amaram e querem incluir coisas 🙏",
    audio: "/landing/depoimento6.mp3",
  },
];

export interface Step {
  num: number;
  emoji: string;
  title: string;
  desc: string;
  emotion: string;
}

export const STEPS: Step[] = [
  {
    num: 1,
    emoji: "🎯",
    title: "Escolha a ocasião",
    desc: "Aniversário, casamento, chá revelação, Dia das Mães, declaração de amor…",
    emotion: "A IA já começa a entender quem vai receber o presente.",
  },
  {
    num: 2,
    emoji: "🎸",
    title: "Escolha o estilo",
    desc: "Sertanejo, MPB, Gospel, Pop, Pagode, o ritmo que mais emociona quem vai receber.",
    emotion: "O ritmo certo faz ela bater o pé e chorar ao mesmo tempo.",
  },
  {
    num: 3,
    emoji: "📖",
    title: "Conte a história",
    desc: "Nome, memórias, datas e detalhes especiais. Quanto mais você conta, mais emocionante fica.",
    emotion: "Vai parecer que a música foi feita por quem mais te conhece.",
  },
  {
    num: 4,
    emoji: "✍️",
    title: "Aprove a letra",
    desc: "A IA cria a letra. Você lê, edita e aprova antes de gerar o áudio.",
    emotion: "É o momento em que você já sente arrepios antes do áudio começar.",
  },
  {
    num: 5,
    emoji: "🎵",
    title: "Ouça e decida",
    desc: "Escute a prévia de graça. Só paga a música completa se amar o resultado.",
    emotion: "A maioria chora antes de terminar o primeiro verso.",
  },
];

export interface Occasion {
  emoji: string;
  title: string;
  desc: string;
}

export const OCCASIONS: Occasion[] = [
  { emoji: "🎂", title: "Aniversário", desc: "Com o nome e a história" },
  { emoji: "💕", title: "Namorado(a)", desc: "Declaração inesquecível" },
  { emoji: "👶", title: "Chá Revelação", desc: "Revele com emoção" },
  { emoji: "💍", title: "Casamento", desc: "Trilha da cerimônia" },
  { emoji: "👩", title: "Dia das Mães", desc: "Homenagem que emociona" },
  { emoji: "🥳", title: "15 Anos", desc: "Para a debutante" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'Como funciona o "ouça antes de pagar"?',
    a: "Você cria a música completa e ouve a prévia gratuitamente. Só decide se paga depois de escutar. Se não gostar, não cobramos nada.",
  },
  {
    q: "Em quanto tempo minha música fica pronta?",
    a: "Em poucos minutos depois de você preencher as informações. Nossa IA cria a letra e gera o áudio na hora.",
  },
  {
    q: "Posso editar a letra antes do áudio?",
    a: "Sim! Você vê a letra completa antes de gerar o áudio e pode alterar palavras, versos e detalhes até ficar perfeita.",
  },
  {
    q: "Em que formato recebo o arquivo?",
    a: "Você recebe um MP3 de alta qualidade, pronto para compartilhar no WhatsApp ou em qualquer lugar.",
  },
  {
    q: "Posso usar no chá revelação ou casamento?",
    a: "Sim! Você pode usar a música em eventos, vídeos e redes sociais sem nenhum custo adicional.",
  },
];
