import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  /** Optional small (~200px) thumbnail file for the carousel thumbnail row. When
   *  absent, the carousel falls back to `src`. Needed because the site's image
   *  optimizer is bypassed (image-loader.js), so a 150px thumbnail would otherwise
   *  download the full-size `src` file. */
  thumb?: string;
}

// Long-description (16:9) block: full content width, caption below. The very
// first image on a page should pass priority so it becomes the LCP element —
// explicit width/height reserve the box before the file loads, so no CLS.
export const LongImage = ({ src, alt, title, priority = false }: GalleryImage & { priority?: boolean }) => (
  <figure className="my-6">
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
      <Image
        src={src}
        alt={alt}
        title={title}
        width={1200}
        height={675}
        className="h-full w-full object-cover"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
    <figcaption className="mt-2 text-center text-sm text-muted-foreground">{title}</figcaption>
  </figure>
);

// 1:1 gallery grid with a lightweight, dependency-free lightbox. By default all
// images lazy-load; pass priorityFirst when this grid is the page's primary
// top-of-page product gallery so its first image (index 0) becomes the LCP
// element instead — explicit square dimensions prevent CLS either way.
export const GalleryGrid = ({ images, priorityFirst = false }: { images: GalleryImage[]; priorityFirst?: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, index) => {
          const isPriority = priorityFirst && index === 0;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
              aria-label={`Open image: ${img.title}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                title={img.title}
                width={800}
                height={800}
                loading={isPriority ? undefined : 'lazy'}
                priority={isPriority}
                fetchPriority={isPriority ? 'high' : undefined}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={images[openIndex].title}
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
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
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                title={images[openIndex].title}
                width={800}
                height={800}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-white/90">{images[openIndex].title}</p>
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
