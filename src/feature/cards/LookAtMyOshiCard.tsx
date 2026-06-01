import { forwardRef, useEffect, useRef, useState } from 'react';
import { ImageUploader } from '@/components/atoms/ImageUploader';
import { InputForm } from '@/components/atoms/InputForm';
import { TextArea } from '@/components/atoms/TextArea';
import { LookAtMyOshiCardText } from '@/constant/cards.constant';
import { useSekaiColor } from '@/hooks/useSekaiColor';

export const LOOK_AT_MY_OSHI_CARD_WIDTH = 960;
export const LOOK_AT_MY_OSHI_CARD_HEIGHT = 540;

const CENTER_X = LOOK_AT_MY_OSHI_CARD_WIDTH / 2;
const CENTER_Y = LOOK_AT_MY_OSHI_CARD_HEIGHT / 2;
const ORBIT_RX = 250;
const ORBIT_RY = 190;
const FIELD_WIDTH = 180;
const FIELD_HEIGHT = 72;
const TEXTAREA_WIDTH = 300;
const TEXTAREA_HEIGHT = 150;
const TEXTAREA_INDEX = 2;
const IMAGE_RADIUS = 128;

function getFieldPositions(labels: string[]) {
  return labels.map((label, i) => {
    const angle = (2 * Math.PI * i) / labels.length - Math.PI / 2;
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

  const fields = getFieldPositions(LookAtMyOshiCardText.inputLabels);

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

        {fields.map(({ label, left, top }, i) =>
          i === TEXTAREA_INDEX ? (
            <div
              key={label}
              style={{
                position: 'absolute',
                left,
                top,
                width: TEXTAREA_WIDTH,
                height: TEXTAREA_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
              }}>
              <TextArea />
            </div>
          ) : (
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
          ),
        )}
      </div>
    </div>
  );
});

LookAtMyOshiCard.displayName = 'LookAtMyOshiCard';
