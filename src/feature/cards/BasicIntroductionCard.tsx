import { forwardRef } from 'react';
import { InputForm } from '@/components/atoms/InputForm';
import { TextArea } from '@/components/atoms/TextArea';
import { Gallery } from '@/components/molecules/Gallery';
import { BasicIntroductionCardText, CARD_HEIGHT, CARD_WIDTH } from '@/constant/cards.constant';
import { useCardScale } from '@/hooks/useCardScale';
import { useSekaiColor } from '@/hooks/useSekaiColor';

export const BasicIntroductionCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { border } = useSekaiColor();
  const { wrapperRef, scale } = useCardScale(CARD_WIDTH);

  return (
    <div ref={wrapperRef} className="w-full max-w-240" style={{ height: CARD_HEIGHT * scale }}>
      <div
        data-card-content="true"
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className={`bg-white border ${border} p-4`}>
        <p className="text-2xl font-bold">{BasicIntroductionCardText.cardTitle}</p>
        <div className="flex gap-4">
          <div style={{ width: 400 }}>
            {BasicIntroductionCardText.inputLabels.map((label) => (
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
