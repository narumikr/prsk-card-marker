import { NamePlate } from '@naru/untitled-ui-library';
import { TextAreaText } from '@/constant/components.constant';

export const TextArea = () => {
  return (
    <div className="relative flex min-h-0 h-full flex-col pt-4">
      <div className="absolute left-4 top-4 z-10 -translate-y-1/2 bg-white px-2">
        <NamePlate text={TextAreaText.title} className="w-48" />
      </div>
      <div className="min-h-0 flex-1 rounded border border-miku px-3 pb-3 pt-4">
        <textarea
          aria-label={TextAreaText.title}
          className="h-full min-h-0 resize-none rounded border-0 px-2 py-1 font-bold outline-none focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
};
