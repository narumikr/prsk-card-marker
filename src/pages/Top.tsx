import { BasicButton, Loading } from '@naru/untitled-ui-library';
import { useRef, useState } from 'react';
import { CARD_HEIGHT, CARD_WIDTH, OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH } from '@/constant/cards.constant';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { BasicCardType, LookAtMyOshiCardType, OfficialProfileCardType } from '@/constant/sidemenu.constants';
import { useCardType } from '@/context/CardTypeContext';
import { BasicIntroductionCard } from '@/feature/cards/BasicIntroductionCard';
import { LookAtMyOshiCard } from '@/feature/cards/LookAtMyOshiCard';
import { OfficialProfileCard } from '@/feature/cards/OfficialProfileCard';

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
        console.warn('画像の読み込みに失敗しました', image.currentSrc || image.src);
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!profileRef.current || isGenerating) return;
    const el = profileRef.current;

    setIsGenerating(true);
    try {
      const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(imgs.map(waitForImageReady));

      await document.fonts.ready;

      const isOfficial = cardType === OfficialProfileCardType;
      const width = isOfficial ? OFFICIAL_CARD_WIDTH : CARD_WIDTH;
      const height = isOfficial ? OFFICIAL_CARD_HEIGHT : CARD_HEIGHT;

      const { domToBlob } = await import('modern-screenshot');
      const blob = await domToBlob(el, {
        backgroundColor: null,
        height,
        scale: 2,
        style: { transform: 'none' },
        width,
      });

      downloadBlob(blob, TOP_PAGE_TEXT.profileFileName);
    } catch (error) {
      console.error(TOP_PAGE_TEXT.genImageErrorLog, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-8">
      {cardType === BasicCardType && <BasicIntroductionCard ref={profileRef} />}
      {cardType === LookAtMyOshiCardType && <LookAtMyOshiCard ref={profileRef} />}
      {cardType === OfficialProfileCardType && <OfficialProfileCard ref={profileRef} />}
      <BasicButton type="button" onClick={handleDownload} disabled={isGenerating} className="--content-font">
        {TOP_PAGE_TEXT.saveImageButtonLabel}
      </BasicButton>
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
          <Loading />
        </div>
      )}
    </main>
  );
}
