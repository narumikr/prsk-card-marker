import { BasicButton } from '@naru/untitled-ui-library';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { BasicIntroductionCard, CARD_HEIGHT, CARD_WIDTH } from '@/components/templates/BasicIntroductionCard';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';

export function Top() {
  const profileRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!profileRef.current) return;

    const el = profileRef.current;

    // DOM上の全画像が読み込み完了するまで待つ
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
    await Promise.all(
      imgs
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }),
        ),
    );

    const options = {
      style: { transform: 'none', transformOrigin: 'top left' },
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      pixelRatio: 2,
      skipFonts: true,
    };

    try {
      // html-to-imageはブラウザキャッシュとは別に画像を内部でre-fetchする。
      // モバイルでは処理が遅くfetch完了前にcanvasが描画されて白化する問題が確認されている。
      // 1回目で内部キャッシュを温め、2回目で確実にキャプチャするworkaround。
      await toPng(el, options);
      const dataUrl = await toPng(el, options);
      const link = document.createElement('a');
      link.download = TOP_PAGE_TEXT.profileFileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(TOP_PAGE_TEXT.genImageErrorLog, error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <BasicIntroductionCard ref={profileRef} />
      <BasicButton type="button" onClick={handleDownload}>
        {TOP_PAGE_TEXT.saveImageButtonLabel}
      </BasicButton>
    </main>
  );
}
