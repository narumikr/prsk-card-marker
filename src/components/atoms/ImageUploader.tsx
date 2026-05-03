import { useEffect, useRef, useState } from 'react';

export function ImageUploader() {
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

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

      <button
        type="button"
        onClick={openFileDialog}
        className="mx-auto flex aspect-video w-full max-w-3xl cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sky-400/80 bg-gray-400 shadow-lg shadow-black/30 backdrop-blur-sm transition hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300/90">
        {previewUrl ? (
          <img src={previewUrl} alt="選択した画像" className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl font-bold leading-none text-sky-200">+</span>
        )}
      </button>
    </>
  );
}
