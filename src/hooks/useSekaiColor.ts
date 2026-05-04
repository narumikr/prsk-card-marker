import { type ColorsSekaiKey, useCreateSekai } from '@naru/untitled-ui-library';

const SEKAI_COLOR_CLASSES: Record<ColorsSekaiKey, { text: string; border: string; ring: string }> = {
  Miku: { text: 'text-miku', border: 'border-miku', ring: 'ring-miku' },
  Rin: { text: 'text-rin', border: 'border-rin', ring: 'ring-rin' },
  Len: { text: 'text-len', border: 'border-len', ring: 'ring-len' },
  Luka: { text: 'text-luka', border: 'border-luka', ring: 'ring-luka' },
  Meiko: { text: 'text-meiko', border: 'border-meiko', ring: 'ring-meiko' },
  Kaito: { text: 'text-kaito', border: 'border-kaito', ring: 'ring-kaito' },
  Ichika: { text: 'text-ichika', border: 'border-ichika', ring: 'ring-ichika' },
  Saki: { text: 'text-saki', border: 'border-saki', ring: 'ring-saki' },
  Honami: { text: 'text-honami', border: 'border-honami', ring: 'ring-honami' },
  Shiho: { text: 'text-shiho', border: 'border-shiho', ring: 'ring-shiho' },
  Minori: { text: 'text-minori', border: 'border-minori', ring: 'ring-minori' },
  Haruka: { text: 'text-haruka', border: 'border-haruka', ring: 'ring-haruka' },
  Airi: { text: 'text-airi', border: 'border-airi', ring: 'ring-airi' },
  Shizuku: { text: 'text-shizuku', border: 'border-shizuku', ring: 'ring-shizuku' },
  Kohane: { text: 'text-kohane', border: 'border-kohane', ring: 'ring-kohane' },
  An: { text: 'text-an', border: 'border-an', ring: 'ring-an' },
  Akito: { text: 'text-akito', border: 'border-akito', ring: 'ring-akito' },
  Toya: { text: 'text-toya', border: 'border-toya', ring: 'ring-toya' },
  Tsukasa: { text: 'text-tsukasa', border: 'border-tsukasa', ring: 'ring-tsukasa' },
  Emu: { text: 'text-emu', border: 'border-emu', ring: 'ring-emu' },
  Nene: { text: 'text-nene', border: 'border-nene', ring: 'ring-nene' },
  Rui: { text: 'text-rui', border: 'border-rui', ring: 'ring-rui' },
  Kanade: { text: 'text-kanade', border: 'border-kanade', ring: 'ring-kanade' },
  Mafuyu: { text: 'text-mafuyu', border: 'border-mafuyu', ring: 'ring-mafuyu' },
  Ena: { text: 'text-ena', border: 'border-ena', ring: 'ring-ena' },
  Mizuki: { text: 'text-mizuki', border: 'border-mizuki', ring: 'ring-mizuki' },
  Virtualsinger: { text: 'text-virtualsinger', border: 'border-virtualsinger', ring: 'ring-virtualsinger' },
  Leoneed: { text: 'text-leoneed', border: 'border-leoneed', ring: 'ring-leoneed' },
  Moremorejump: { text: 'text-moremorejump', border: 'border-moremorejump', ring: 'ring-moremorejump' },
  Vividbadsquad: { text: 'text-vividbadsquad', border: 'border-vividbadsquad', ring: 'ring-vividbadsquad' },
  Wonderlandsshowtime: {
    text: 'text-wonderlandsshowtime',
    border: 'border-wonderlandsshowtime',
    ring: 'ring-wonderlandsshowtime',
  },
  Nightcode: { text: 'text-nightcode', border: 'border-nightcode', ring: 'ring-nightcode' },
};

export const useSekaiColor = () => {
  const { sekaiTheme } = useCreateSekai();
  return SEKAI_COLOR_CLASSES[sekaiTheme.palette.sekai];
};
