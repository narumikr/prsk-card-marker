import { useRef, useState } from 'react';
import { ImageUploaderText } from '@/constant/components.constant';
import { useSekaiColor } from '@/hooks/useSekaiColor';

interface ImageUploaderProps {
  shape?: 'rectangle' | 'circle';
}

export const ImageUploader = ({ shape = 'rectangle' }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.onerror = () => {
      console.error(ImageUploaderText.imageReadErrorLog, file.name, reader.error);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const { text, border, ring } = useSekaiColor();
  const isCircle = shape === 'circle';
  const buttonClassName = isCircle
    ? `mx-auto flex h-48 w-48 cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full transition focus:outline-none focus:ring-2 ${ring} ${
        previewUrl ? '' : `border-2 border-dashed ${border} bg-gray-300 hover:bg-gray-400`
      }`
    : `mx-auto flex aspect-video w-full max-w-3xl cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 ${ring} ${
        previewUrl ? '' : `border-2 border-dashed ${border} bg-gray-300 hover:bg-gray-400`
      }`;

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

      <button type="button" onClick={openFileDialog} className={buttonClassName}>
        {previewUrl ? (
          <img src={previewUrl} alt={ImageUploaderText.selectedAlt} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-6xl font-bold leading-none ${text}`}>+</span>
        )}
      </button>
    </>
  );
};
