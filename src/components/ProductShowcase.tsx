import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';

interface LightweightProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string;
  on_sale: boolean;
  featured_image: string;
  category: string;
  category_slug?: string;
}

interface ProductShowcaseProps {
  featuredProducts: LightweightProduct[];
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ featuredProducts = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm mb-4">
              Live Product Catalogue
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Browse Our Portable Cabins &amp; Container Offices
            </h2>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Prices, specs and photos — pulled directly from our product catalogue. Click any product to get full details and request a quote.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-300 hover:border-[#0A3D2A] hover:text-[#0A3D2A]" aria-label="Previous slide">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-300 hover:border-[#0A3D2A] hover:text-[#0A3D2A]" aria-label="Next slide">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Link href="/product">
              <Button
                size="lg"
                className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white px-6 py-2 h-10 text-base font-semibold shadow-md transition-all duration-200"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6 pb-4">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6 min-w-0">
                  <ProductCard
                    product={product}
                    priority={index < 3} // Priority loading for first 3 products
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Products Available
            </h3>
            <p className="text-muted-foreground mb-6">
              We&apos;re currently updating our product catalog. Please check back soon!
            </p>
            <Link href="/product">
              <Button
                size="lg"
                className="bg-[#0A3D2A] hover:bg-[#0A3D2A] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;

