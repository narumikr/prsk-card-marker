import type { ColorsSekaiKey } from '@naru/untitled-ui-library';

/**
 * 推し選択Dropdownアイテム
 */
export const OshiDropdownItem: { label: string; value: ColorsSekaiKey }[] = [
  { label: '初音ミク', value: 'Miku' },
  { label: '鏡音リン', value: 'Rin' },
  { label: '鏡音レン', value: 'Len' },
  { label: '巡音ルカ', value: 'Luka' },
  { label: 'MEIKO', value: 'Meiko' },
  { label: 'KAITO', value: 'Kaito' },
  { label: '星乃 一歌', value: 'Ichika' },
  { label: '天馬 咲希', value: 'Saki' },
  { label: '望月 穂波', value: 'Honami' },
  { label: '日野森 志歩', value: 'Shiho' },
  { label: '花里 みのり', value: 'Minori' },
  { label: '桐谷 遥', value: 'Haruka' },
  { label: '桃井 愛莉', value: 'Airi' },
  { label: '日野森 雫', value: 'Shizuku' },
  { label: '小豆沢 こはね', value: 'Kohane' },
  { label: '白石 杏', value: 'An' },
  { label: '東雲 彰人', value: 'Akito' },
  { label: '青柳 冬弥', value: 'Toya' },
  { label: '天馬 司', value: 'Tsukasa' },
  { label: '鳳 えむ', value: 'Emu' },
  { label: '草薙 寧々', value: 'Nene' },
  { label: '神代 類', value: 'Rui' },
  { label: '宵崎 奏', value: 'Kanade' },
  { label: '朝比奈 まふゆ', value: 'Mafuyu' },
  { label: '東雲 絵名', value: 'Ena' },
  { label: '暁山 瑞希', value: 'Mizuki' },
  { label: 'バーチャル・シンガー', value: 'Virtualsinger' },
  { label: 'Leo/need', value: 'Leoneed' },
  { label: 'MORE MORE JUMP!', value: 'Moremorejump' },
  { label: 'Vivid BAD SQUAD', value: 'Vividbadsquad' },
  { label: 'ワンダーランズ×ショウタイム', value: 'Wonderlandsshowtime' },
  { label: '25時、ナイトコードで。', value: 'Nightcode' },
];

/**
 * カード種類
 */
export const CardTypeDropdownItem = [
  { label: '自己紹介', value: 'basic' },
  { label: '私の推し', value: 'look-at-my-oshi' },
] as const;

export type CardTypeValue = (typeof CardTypeDropdownItem)[number]['value'];

/**
 * 文字フォント
 */
export const FontFamily = [
  // デフォルト
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  // 一般的
  { label: 'Noto Sans JP', value: 'Noto Sans JP, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Sawarabi Gothic', value: 'Sawarabi Gothic, sans-serif' },
  // 手書き系
  { label: 'Yomogi', value: 'Yomogi, sans-serif' },
  { label: 'Yusei Magic', value: 'Yusei Magic, sans-serif' },
  { label: 'Zen Maru Gothic', value: 'Zen Maru Gothic, sans-serif' },
  { label: 'Hachi Maru Pop', value: 'Hachi Maru Pop, cursive' },
  { label: 'Kaisei HarunoUmi', value: 'Kaisei HarunoUmi, serif' },
  // 可愛い系
  { label: 'Shantell Sans', value: 'Shantell Sans, sans-serif' },
  // かっこいい系
  { label: 'Zen Kurenaido', value: 'Zen Kurenaido, sans-serif' },
  { label: 'Space Mono', value: 'Space Mono, monospace' },
  // その他
  { label: 'Sawarabi Mincho', value: 'Sawarabi Mincho, serif' },
];
