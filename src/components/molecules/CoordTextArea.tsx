import { TextArea } from '@/components/atoms/TextArea';

interface CoordTextAreaProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  className?: string;
}

export const CoordTextArea = ({ x, y, w, h, label, className }: CoordTextAreaProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        padding: 0,
      }}>
      <TextArea label={label} className={`h-full w-full ${className}`} />
    </div>
  );
};
