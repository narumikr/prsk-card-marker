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
const inflightLoads = new Map<string, Promise<void>>();

const FONT_LOAD_ERROR_LOG = 'Google Fontの読み込みに失敗しました';

const parseFamilyName = (fontFamilyValue: string): string => {
  const [familyName = ''] = fontFamilyValue.split(',');
  return familyName.trim().replace(/^['"]|['"]$/g, '');
};

const loadFamily = async (familyName: string, query: string): Promise<void> => {
  const url = `${GOOGLE_FONTS_BASE_URL}?${query}&display=swap`;
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to fetch font CSS: ${response.status}`);
  }
  const cssText = await response.text();

  // html-to-image reads document.styleSheets for @font-face rules, so we
  // need the CSS text in a <style> node (not just FontFace objects added
  // via the JS API). The browser will also auto-register matching
  // FontFace entries in document.fonts when it parses this <style>.
  const style = document.createElement('style');
  style.dataset.googleFontFamily = familyName;
  style.textContent = cssText;
  document.head.append(style);

  await document.fonts.load(`10px "${familyName}"`);
  loadedFamilies.add(familyName);
};

export const loadGoogleFont = async (fontFamilyValue: string): Promise<void> => {
  const familyName = parseFamilyName(fontFamilyValue);
  const query = fontQueryByFamilyName[familyName];

  if (!query || loadedFamilies.has(familyName)) {
    return;
  }

  const existing = inflightLoads.get(familyName);
  if (existing) {
    return existing;
  }

  const promise = loadFamily(familyName, query).catch((error) => {
    console.warn(FONT_LOAD_ERROR_LOG, familyName, error);
  });
  inflightLoads.set(familyName, promise);
  try {
    await promise;
  } finally {
    inflightLoads.delete(familyName);
  }
};
