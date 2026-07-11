import { BasicButton } from '@naru/untitled-ui-library';
import { useRef } from 'react';
import { CARD_HEIGHT, CARD_WIDTH, OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH } from '@/constant/cards.constant';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { BasicCardType, LookAtMyOshiCardType, OfficialProfileCardType } from '@/constant/sidemenu.constants';
import { useCardType } from '@/context/CardTypeContext';
import { BasicIntroductionCard } from '@/feature/cards/BasicIntroductionCard';
import { LookAtMyOshiCard } from '@/feature/cards/LookAtMyOshiCard';
import { OfficialProfileCard } from '@/feature/cards/OfficialProfileCard';

const IMAGE_LOAD_WARN_LOG = '画像の読み込みに失敗しました';

const waitForImageReady = async (image: HTMLImageElement) => {
  if (image.complete) {
    await image.decode().catch(() => undefined);
    return;
  }

  await new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener(
      'error',
      () => {
        console.warn(IMAGE_LOAD_WARN_LOG, image.currentSrc || image.src);
        resolve();
      },
      { once: true },
    );
  });
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.download = fileName;
  link.href = objectUrl;
  link.click();

  // 一部ブラウザで download 開始前に revoke されるのを避けるため 2 フレーム待つ
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      URL.revokeObjectURL(objectUrl);
    });
  });
};

export function Top() {
  const profileRef = useRef<HTMLDivElement>(null);
  const { cardType } = useCardType();

  const handleDownload = async () => {
    if (!profileRef.current) return;
    const el = profileRef.current;

    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
    await Promise.all(imgs.map((img) => waitForImageReady(img)));

    await document.fonts.ready;

    const isOfficial = cardType === OfficialProfileCardType;
    const width = isOfficial ? OFFICIAL_CARD_WIDTH : CARD_WIDTH;
    const height = isOfficial ? OFFICIAL_CARD_HEIGHT : CARD_HEIGHT;

    try {
      const { domToBlob } = await import('modern-screenshot');
      const blob = await domToBlob(el, {
        backgroundColor: null,
        height,
        scale: 2,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
        },
        width,
      });

      downloadBlob(blob, TOP_PAGE_TEXT.profileFileName);
    } catch (error) {
      console.error(TOP_PAGE_TEXT.genImageErrorLog, error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-8">
      {cardType === BasicCardType && <BasicIntroductionCard ref={profileRef} />}
      {cardType === LookAtMyOshiCardType && <LookAtMyOshiCard ref={profileRef} />}
      {cardType === OfficialProfileCardType && <OfficialProfileCard ref={profileRef} />}
      <BasicButton type="button" onClick={handleDownload} className="--content-font">
        {TOP_PAGE_TEXT.saveImageButtonLabel}
      </BasicButton>
    </main>
  );
}
