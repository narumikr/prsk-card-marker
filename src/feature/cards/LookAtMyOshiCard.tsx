import { forwardRef, useEffect, useRef, useState } from 'react';
import { ImageUploader } from '@/components/atoms/ImageUploader';
import { InputForm } from '@/components/atoms/InputForm';
import { LookAtMyOshiCardText } from '@/constant/cards.constant';
import { useSekaiColor } from '@/hooks/useSekaiColor';

export const LOOK_AT_MY_OSHI_CARD_WIDTH = 960;
export const LOOK_AT_MY_OSHI_CARD_HEIGHT = 540;

const CENTER_X = LOOK_AT_MY_OSHI_CARD_WIDTH / 2;
const CENTER_Y = LOOK_AT_MY_OSHI_CARD_HEIGHT / 2;
const ORBIT_RX = 250;
const ORBIT_RY = 220;
const FIELD_WIDTH = 180;
const FIELD_HEIGHT = 72;
const IMAGE_RADIUS = 128;

function getPositions(labels: string[], startDeg: number, stepDeg: number) {
  return labels.map((label, i) => {
    const angle = ((startDeg + stepDeg * i) * Math.PI) / 180;
    const cx = CENTER_X + ORBIT_RX * Math.cos(angle);
    const cy = CENTER_Y + ORBIT_RY * Math.sin(angle);
    return { label, left: cx - FIELD_WIDTH / 2, top: cy - FIELD_HEIGHT / 2 };
  });
}

export const LookAtMyOshiCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { border } = useSekaiColor();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / LOOK_AT_MY_OSHI_CARD_WIDTH, 1));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const leftFields = getPositions(LookAtMyOshiCardText.leftLabels, 240, -30);
  const rightFields = getPositions(LookAtMyOshiCardText.rightLabels, 300, 30);

  return (
    <div ref={wrapperRef} className="w-full max-w-240" style={{ height: LOOK_AT_MY_OSHI_CARD_HEIGHT * scale }}>
      <div
        ref={ref}
        style={{
          width: LOOK_AT_MY_OSHI_CARD_WIDTH,
          height: LOOK_AT_MY_OSHI_CARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
        }}
        className={`bg-white border ${border}`}>
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
