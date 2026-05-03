import { BasicButton } from '@naru/untitled-ui-library';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { InputForm } from '@/components/atoms/InputForm';
import { TextArea } from '@/components/atoms/TextArea';
import { Gallery } from '@/components/molecules/Gallery';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';

export function Top() {
  const profileRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!profileRef.current) return;
    try {
      const dataUrl = await toPng(profileRef.current);
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
      <div ref={profileRef} style={{ width: 960, height: 540 }} className="bg-white border border-miku p-4">
        <p className="text-2xl font-bold">プロセカ自己紹介カード</p>
        <div className="flex gap-4">
          <div style={{ width: 400 }}>
            {TOP_PAGE_TEXT.inputLabels.map((label) => (
              <InputForm key={label} label={label} />
            ))}
          </div>
          <div style={{ width: 560 }} className="flex flex-col gap-4">
            <Gallery />
            <TextArea />
          </div>
        </div>
      </div>
      <BasicButton type="button" onClick={handleDownload}>
        {TOP_PAGE_TEXT.saveImageButtonLabel}
      </BasicButton>
    </main>
  );
}
