import { forwardRef, useEffect, useRef, useState } from 'react';
import { InputForm } from '@/components/atoms/InputForm';
import { TextArea } from '@/components/atoms/TextArea';
import { Gallery } from '@/components/molecules/Gallery';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { useSekaiColor } from '@/hooks/useSekaiColor';

export const CARD_WIDTH = 960;
export const CARD_HEIGHT = 540;

export const BasicIntroductionCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { border } = useSekaiColor();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / CARD_WIDTH, 1));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full max-w-240" style={{ height: CARD_HEIGHT * scale }}>
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className={`bg-white border ${border} p-4`}>
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
    </div>
  );
});

BasicIntroductionCard.displayName = 'BasicIntroductionCard';
