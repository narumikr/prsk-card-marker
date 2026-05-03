import { NamePlate } from '@naru/untitled-ui-library';
import { ImageUploader } from '@/components/atoms/ImageUploader';
import { GalleryText } from '@/constant/components.constant';

const GALLERY_IMAGES = [1, 2, 3, 4] as const;

export const Gallery = () => {
  return (
    <div className="relative flex flex-col pt-4">
      <div className="absolute left-4 top-4 z-10 -translate-y-1/2 bg-white px-2">
        <NamePlate text={GalleryText.title} className="w-48" />
      </div>
      <div className="rounded border border-miku px-3 pb-3 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {GALLERY_IMAGES.map((id) => (
            <ImageUploader key={`image-${id}`} shape="rectangle" />
          ))}
        </div>
      </div>
    </div>
  );
};
