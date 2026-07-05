import { BasicButton } from '@naru/untitled-ui-library';
import { useRef } from 'react';
import { CARD_HEIGHT, CARD_WIDTH, OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH } from '@/constant/cards.constant';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { BasicCardType, LookAtMyOshiCardType, OfficialProfileCardType } from '@/constant/sidemenu.constants';
import { useCardType } from '@/context/CardTypeContext';
import { BasicIntroductionCard } from '@/feature/cards/BasicIntroductionCard';
import { LookAtMyOshiCard } from '@/feature/cards/LookAtMyOshiCard';
import { OfficialProfileCard } from '@/feature/cards/OfficialProfileCard';

const CARD_CONTENT_SELECTOR = '[data-card-content="true"]';

const waitForImageReady = async (image: HTMLImageElement) => {
  if (image.complete) {
    await image.decode().catch(() => undefined);
    return;
  }

  await new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
};

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error(TOP_PAGE_TEXT.genImageErrorLog));
    }, 'image/png');
  });

const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.download = fileName;
  link.href = objectUrl;
  link.click();

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
    const clampedPixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        height,
        logging: false,
        scale: clampedPixelRatio,
        useCORS: true,
        width,
        onclone: (clonedDocument) => {
          const clonedEl = clonedDocument.querySelector<HTMLElement>(CARD_CONTENT_SELECTOR);

          if (!clonedEl) {
            return;
          }

          clonedEl.style.width = `${width}px`;
          clonedEl.style.height = `${height}px`;
          clonedEl.style.transform = 'none';
          clonedEl.style.transformOrigin = 'top left';
        },
      });

      const blob = await canvasToBlob(canvas);
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
