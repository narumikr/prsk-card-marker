import { NamePlate } from '@naru/untitled-ui-library';

interface InputFormProps {
  label: string;
}

export const InputForm = ({ label }: InputFormProps) => {
  return (
    <div className="relative flex flex-col pt-4">
      <div className="absolute left-4 top-4 z-10 -translate-y-1/2 bg-white px-2">
        <NamePlate text={label} className="w-48" />
      </div>
      <div className="rounded border border-miku px-3 pb-3 pt-4">
        <input
          type="text"
          aria-label={label}
          className="w-full font-bold rounded border-0 px-2 py-1 text-center outline-none focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
};
