
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CourseImageProps {
  imageUrl: string;
  alt: string;
}

const CourseImage = ({ imageUrl, alt }: CourseImageProps) => {
  const { language } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div className="mb-12 relative animate-fade-in">
      <div className="aspect-[21/9] w-full h-[200px] overflow-hidden rounded-2xl">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-2xl">
            <span className="text-gray-400">
              {language === 'en' ? 'Loading image...' : 'Bild wird geladen...'}
            </span>
          </div>
        )}
        <img
          src={imageUrl}
          alt={alt}
          className={cn(
            "w-full h-[200px] object-cover rounded-2xl transition-opacity duration-500",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  );
};

export default CourseImage;
