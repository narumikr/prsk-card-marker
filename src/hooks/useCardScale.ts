import { useEffect, useRef, useState } from 'react';

export function useCardScale(cardWidth: number) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / cardWidth, 1));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [cardWidth]);

  return { wrapperRef, scale };
}
