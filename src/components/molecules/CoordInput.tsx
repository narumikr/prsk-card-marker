import { Input } from '@/components/atoms/Input';

interface CoordInputProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  className?: string;
}

export const CoordInput = ({ x, y, w, h, label, className }: CoordInputProps) => {
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
      <Input label={label} className={`h-full w-full ${className}`} />
    </div>
  );
};
