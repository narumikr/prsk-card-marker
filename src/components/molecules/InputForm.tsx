import { NamePlate } from '@naru/untitled-ui-library';
import { Input } from '@/components/atoms/Input';
import { useSekaiColor } from '@/hooks/useSekaiColor';

interface InputFormProps {
  label: string;
}

export const InputForm = ({ label }: InputFormProps) => {
  const { border } = useSekaiColor();
  return (
    <div className="relative flex flex-col pt-4">
      <div className="absolute left-4 top-4 z-10 -translate-y-1/2 bg-white px-2">
        <NamePlate text={label} className="w-48" />
      </div>
      <div className={`rounded border ${border} px-3 pb-3 pt-4`}>
        <Input label={label} className="px-2 py-1" />
      </div>
    </div>
  );
};
