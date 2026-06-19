import { forwardRef } from 'react';
import { ImageUploader } from '@/components/atoms/ImageUploader';
import { InputForm } from '@/components/atoms/InputForm';
import { CARD_HEIGHT, CARD_WIDTH, LookAtMyOshiCardText } from '@/constant/cards.constant';
import { useCardScale } from '@/hooks/useCardScale';
import { useSekaiColor } from '@/hooks/useSekaiColor';

const CENTER_X = CARD_WIDTH / 2;
const CENTER_Y = CARD_HEIGHT / 2;
const ORBIT_RX = 280;
const ORBIT_RY = 220;
const FIELD_WIDTH = 220;
const FIELD_HEIGHT = 84;
const IMAGE_RADIUS = 128;

function getPositions(labels: string[], startDeg: number, stepDeg: number, yOffsets: number[] = []) {
  return labels.map((label, i) => {
    const angle = ((startDeg + stepDeg * i) * Math.PI) / 180;
    const cx = CENTER_X + ORBIT_RX * Math.cos(angle);
    const cy = CENTER_Y + ORBIT_RY * Math.sin(angle);
    return { label, left: cx - FIELD_WIDTH / 2, top: cy - FIELD_HEIGHT / 2 + (yOffsets[i] ?? 0) };
  });
}

export const LookAtMyOshiCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { border } = useSekaiColor();
  const { wrapperRef, scale } = useCardScale(CARD_WIDTH);

  const leftFields = getPositions(LookAtMyOshiCardText.leftLabels, 240, -30, [0, 10, 0, -10, 0]);
  const rightFields = getPositions(LookAtMyOshiCardText.rightLabels, 300, 30, [0, 10, 0, -10, 0]);

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
          position: 'relative',
        }}
        className={`bg-white border ${border}`}>
        <div
          style={{
            position: 'absolute',
            inset: 16,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 8,
            opacity: 0.5,
          }}>
          {[0, 1, 2, 3].map((i) => (
            <ImageUploader key={i} shape="rectangle" fill />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: CENTER_X - IMAGE_RADIUS,
            top: CENTER_Y - IMAGE_RADIUS,
          }}>
          <ImageUploader shape="circle" circleSizeClass="h-64 w-64" />
        </div>

        {[...leftFields, ...rightFields].map(({ label, left, top }) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              left,
              top,
              width: FIELD_WIDTH,
            }}>
            <InputForm label={label} />
          </div>
        ))}
      </div>
    </div>
  );
});

LookAtMyOshiCard.displayName = 'LookAtMyOshiCard';
