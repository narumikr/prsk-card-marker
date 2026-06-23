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
  const temp = 'border border-red-500';
  return (
    <div
      className={temp}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
      }}>
      <Input label={label} className={className} />
    </div>
  );
};
