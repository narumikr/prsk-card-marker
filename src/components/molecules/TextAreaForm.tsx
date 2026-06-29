import { NamePlate } from '@naru/untitled-ui-library';
import { TextArea } from '@/components/atoms/TextArea';
import { useSekaiColor } from '@/hooks/useSekaiColor';

const TextAreaText = {
  title: 'フリースペース',
} as const;

export const TextAreaForm = () => {
  const { border } = useSekaiColor();
  return (
    <div className="relative flex min-h-0 h-full flex-col pt-4">
      <div className="absolute left-4 top-4 z-10 -translate-y-1/2 bg-white px-2">
        <NamePlate text={TextAreaText.title} className="w-48" />
      </div>
      <div className={`min-h-0 flex-1 rounded border ${border} px-3 pb-3 pt-4`}>
        <TextArea label={TextAreaText.title} className="h-full min-h-0 px-2 py-1" />
      </div>
    </div>
  );
};
