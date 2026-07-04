const GOOGLE_FONTS_BASE_URL = 'https://fonts.googleapis.com/css2';

const fontQueryByFamilyName: Record<string, string> = {
  Montserrat: 'family=Montserrat:wght@400;700',
  'Noto Sans JP': 'family=Noto+Sans+JP',
  Roboto: 'family=Roboto',
  'Sawarabi Gothic': 'family=Sawarabi+Gothic',
  Yomogi: 'family=Yomogi',
  'Yusei Magic': 'family=Yusei+Magic',
  'Zen Maru Gothic': 'family=Zen+Maru+Gothic',
  'Hachi Maru Pop': 'family=Hachi+Maru+Pop',
  'Kaisei HarunoUmi': 'family=Kaisei+HarunoUmi',
  'Shantell Sans': 'family=Shantell+Sans:ital,wght@0,300..800;1,300..800',
  'Zen Kurenaido': 'family=Zen+Kurenaido',
  'Space Mono': 'family=Space+Mono',
  'Sawarabi Mincho': 'family=Sawarabi+Mincho',
};

const loadedFamilies = new Set<string>();

const parseFamilyName = (fontFamilyValue: string): string => {
  const [familyName = ''] = fontFamilyValue.split(',');
  return familyName.trim().replace(/^['"]|['"]$/g, '');
};

export const loadGoogleFont = (fontFamilyValue: string): void => {
  const familyName = parseFamilyName(fontFamilyValue);
  const query = fontQueryByFamilyName[familyName];

  if (!query || loadedFamilies.has(familyName)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${GOOGLE_FONTS_BASE_URL}?${query}&display=swap`;
  // html-to-image が cssRules を参照するため、cross-origin stylesheet を CORS 経由で読めるようにする
  link.crossOrigin = 'anonymous';
  link.dataset.googleFontFamily = familyName;

  document.head.append(link);
  loadedFamilies.add(familyName);
};
