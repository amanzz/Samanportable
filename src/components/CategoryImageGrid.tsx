import React from 'react';
import OptimizedCategoryImage from './OptimizedCategoryImage';

interface CategoryImageGridProps {
  images: Array<{
    src: string;
    alt: string;
    id: string | number;
  }>;
  columns?: number;
  gap?: number;
}

const CategoryImageGrid: React.FC<CategoryImageGridProps> = ({
  images,
  columns = 3,
  gap = 4
}) => {
  // Simple grid layout without complex optimization
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gapSize = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-3'} ${gapSize[gap as keyof typeof gapSize] || 'gap-4'} w-full`}>
      {images.map((image, index) => (
        <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
          <OptimizedCategoryImage
            src={image.src}
            alt={image.alt}
            priority={index < 6} // Only first 6 images get priority
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryImageGrid;

