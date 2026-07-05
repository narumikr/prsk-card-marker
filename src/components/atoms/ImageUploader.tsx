import { useEffect, useRef, useState } from 'react';
import { useSekaiColor } from '@/hooks/useSekaiColor';

const ImageUploaderText = {
  selectedAlt: '選択した画像',
  imageReadErrorLog: '画像の読み込みに失敗しました',
} as const;

type ImageUploaderProps = { shape: 'circle'; circleSizeClass?: string } | { shape?: 'rectangle'; fill?: boolean };

export const ImageUploader = (props: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

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

  const handleSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setIsDecoding(true);
    try {
      const img = new Image();
      img.src = nextUrl;
      await img.decode();
      setPreviewUrl(nextUrl);
    } catch (error) {
      URL.revokeObjectURL(nextUrl);
      console.error(ImageUploaderText.imageReadErrorLog, file.name, error);
    } finally {
      setIsDecoding(false);
    }
  };

  const { text, border, ring } = useSekaiColor();
  const emptyStateClass = previewUrl ? '' : `border-2 border-dashed ${border} bg-gray-300 hover:bg-gray-400`;

  let buttonClassName: string;
  if (props.shape === 'circle') {
    const circleSizeClass = props.circleSizeClass ?? 'h-48 w-48';
    buttonClassName = `mx-auto flex ${circleSizeClass} cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  } else if (props.fill) {
    buttonClassName = `flex h-full w-full cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  } else {
    buttonClassName = `mx-auto flex aspect-video w-full max-w-3xl cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-xl transition focus:outline-none focus:ring-2 ${ring} ${emptyStateClass}`;
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

      <button type="button" onClick={openFileDialog} aria-busy={isDecoding} className={buttonClassName}>
        {previewUrl ? (
          <img src={previewUrl} alt={ImageUploaderText.selectedAlt} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-6xl font-bold leading-none ${text}`}>+</span>
        )}
      </button>
    </>
  );
};
