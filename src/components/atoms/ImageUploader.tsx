import { useEffect, useRef, useState } from 'react';
import { ImageUploaderText } from '@/constant/components.constant';

interface ImageUploaderProps {
  shape?: 'rectangle' | 'circle';
}

export const ImageUploader = ({ shape = 'rectangle' }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
  };

  const isCircle = shape === 'circle';
  const buttonClassName = isCircle
    ? `mx-auto flex h-48 w-48 cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full transition focus:outline-none focus:ring-2 focus:ring-miku ${
        previewUrl ? '' : 'border-2 border-dashed border-miku bg-gray-400 hover:bg-gray-500'
      }`
    : `mx-auto flex aspect-video w-full max-w-3xl cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 focus:ring-miku ${
        previewUrl ? '' : 'border-2 border-dashed border-miku bg-gray-400 hover:bg-gray-500'
      }`;

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

      <button type="button" onClick={openFileDialog} className={buttonClassName}>
        {previewUrl ? (
          <img src={previewUrl} alt={ImageUploaderText['selected-alt']} className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl font-bold leading-none text-miku">+</span>
        )}
      </button>
    </>
  );
};
