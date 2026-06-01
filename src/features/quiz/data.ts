export interface OptionItem {
  value: string;
  label: string;
  emoji: string;
}

export interface OccasionCategory extends OptionItem {
  moments: OptionItem[];
}

/** Etapa 1 → 2: categorias e seus momentos (baseado nas telas de referência). */
export const CATEGORIES: OccasionCategory[] = [
  {
    value: "amor_casal",
    label: "Amor & Casal",
    emoji: "❤️",
    moments: [
      { value: "declaracao", label: "Declaração de Amor", emoji: "💖" },
      { value: "aniv_namoro", label: "Aniversário de Namoro", emoji: "📅" },
      { value: "aniv_casamento", label: "Aniversário de Casamento", emoji: "💍" },
      { value: "desculpas", label: "Pedido de Desculpas", emoji: "🥺" },
      { value: "reconciliacao", label: "Reconciliação", emoji: "🤝" },
      { value: "surpresa", label: "Surpresa Romântica", emoji: "🎁" },
    ],
  },
  {
    value: "familia",
    label: "Família",
    emoji: "👨‍👩‍👧",
    moments: [
      { value: "dia_das_maes", label: "Dia das Mães", emoji: "💐" },
      { value: "dia_dos_pais", label: "Dia dos Pais", emoji: "👔" },
      { value: "aniversario", label: "Aniversário", emoji: "🎂" },
      { value: "homenagem", label: "Homenagem", emoji: "🌟" },
    ],
  },
  {
    value: "amizade",
    label: "Amizade",
    emoji: "🤝",
    moments: [
      { value: "melhor_amigo", label: "Melhor Amigo(a)", emoji: "🫂" },
      { value: "aniv_amigo", label: "Aniversário", emoji: "🎉" },
      { value: "gratidao", label: "Gratidão", emoji: "🙏" },
    ],
  },
  {
    value: "datas",
    label: "Datas Especiais",
    emoji: "🎉",
    moments: [
      { value: "natal", label: "Natal", emoji: "🎄" },
      { value: "formatura", label: "Formatura", emoji: "🎓" },
      { value: "outra", label: "Outra data", emoji: "✨" },
    ],
  },
  {
    value: "fe",
    label: "Fé & Gratidão",
    emoji: "🙏",
    moments: [
      { value: "louvor", label: "Louvor", emoji: "🙌" },
      { value: "agradecimento", label: "Agradecimento", emoji: "✨" },
    ],
  },
];

/** Máximo de ritmos combináveis: 1 estilo ou fusão de 2. */
export const MAX_GENRES = 2;

/** Etapa 3: gêneros que podem ser combinados (fusão). */
export const GENRES: OptionItem[] = [
  { value: "sertanejo", label: "Sertanejo", emoji: "🤠" },
  { value: "funk", label: "Funk", emoji: "🔊" },
  { value: "gospel", label: "Gospel", emoji: "🙌" },
  { value: "louvor", label: "Louvor", emoji: "🙏" },
  { value: "pop", label: "Pop", emoji: "🎤" },
  { value: "rap", label: "Rap", emoji: "🧢" },
  { value: "pagode", label: "Pagode", emoji: "🥁" },
  { value: "forro", label: "Forró", emoji: "🪗" },
  { value: "mpb", label: "MPB", emoji: "🎸" },
];

/** Etapa 5: voz da música. */
export const VOICES: OptionItem[] = [
  { value: "m", label: "Masculina", emoji: "👨" },
  { value: "f", label: "Feminina", emoji: "👩" },
];
