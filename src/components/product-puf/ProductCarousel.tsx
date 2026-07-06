import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from './Gallery';

interface ProductCarouselProps {
  images: GalleryImage[];
}

// Ported from the live template's product gallery (src/pages/product/[category]/[slug].tsx —
// main image + counter badge + arrows + 5-across thumbnail row, selectedIndex state), with two
// additions the live template doesn't have: touch-swipe on the main image, and a click-to-lightbox
// (both required by Addendum 7 FIX 1). Main image uses aspect-square (not the template's
// aspect-[4/3]) because our actual assets are 800x800 — forcing 4:3 on square photos would crop them.
const ProductCarousel = ({ images }: ProductCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  const active = images[selectedIndex];

  return (
    <div className="my-6">
      <div
        className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open image: ${active.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true);
        }}
      >
        <Image
          src={active.src}
          alt={active.alt}
          title={active.title}
          width={800}
          height={800}
          priority={selectedIndex === 0}
          fetchPriority={selectedIndex === 0 ? 'high' : undefined}
          loading={selectedIndex === 0 ? undefined : 'lazy'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 800px"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
            >
              <ArrowLeft className="h-5 w-5 rotate-180 text-gray-700" aria-hidden="true" />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}: ${img.title}`}
              className={`aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-all duration-200 hover:scale-105 ${
                selectedIndex === index
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={150}
                height={150}
                loading="lazy"
                className="h-full w-full object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Close image"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="relative max-h-[80vh] w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image src={active.src} alt={active.alt} title={active.title} width={800} height={800} className="h-full w-full object-contain" />
            </div>
            <p className="mt-3 text-center text-sm text-white/90">{active.title}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white sm:right-4"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
