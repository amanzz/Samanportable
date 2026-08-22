import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';

const heroImages = [
  {
    src: '/hero-image/saman-portable-office-cabin-bangalore-clean.webp',
    alt: 'Modular office buildings with lit windows at dusk'
  },
  {
    src: '/hero-image/premium-container-site-office-rental-clean.webp',
    alt: 'Premium Container Site Office Rental Service by Saman Portable'
  },
  {
    src: '/hero-image/modular-prefab-homes-structures-india-clean.webp',
    alt: 'Modular Prefab Homes and Steel Structures in India - Eco-friendly Construction'
  },
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-section-responsive"
      style={{
        contain: 'layout style paint'
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src={heroImages[0].src}
            alt={heroImages[0].alt}
            fill
            priority
            quality={75}
            sizes="100vw"
            className={`object-cover scale-105 transition-opacity duration-1000 ${currentImageIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        {currentImageIndex !== 0 && (
          <div className="absolute inset-0">
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              quality={75}
              sizes="100vw"
              className="object-cover scale-105 transition-opacity duration-1000"
            />
          </div>
        )}
      </div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto container-padding relative z-20 w-full pt-20 pb-12">
        <div className="hero-grid items-center">
          <div className="hero-left-content text-white">
            {/* H1 — Concise, SEO-optimized */}
            <div className="mb-8">
              <h1
                className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight hero-text-shadow leading-[1.1] text-white"
                style={{
                  contain: 'layout style paint',
                }}
              >
                Premium <span className="text-[#E8F3EF]">Portable Cabins</span> &amp; Container Offices
              </h1>

              {/* Trust badges — refined */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold text-yellow-400">
                  ISO 9001:2015 Certified
                </span>
                <span className="text-white/40 hidden md:inline">•</span>
                <span className="text-sm md:text-base font-medium text-white/90">7–21 Day Delivery</span>
                <span className="text-white/40 hidden md:inline">•</span>
                <span className="text-sm md:text-base font-medium text-white/90">5-Year Structural Warranty</span>
              </div>
            </div>

            {/* Paragraph — refined typography */}
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-light">
              India&apos;s leading manufacturer of high-ticket prefab structures for industrial, construction and commercial headquarters. Delivered ready-to-use since 2009.
            </p>
            {/* CTA Buttons — three CTAs (T2: form removed from hero) */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <QuoteFormTrigger
                size="lg"
                className="btn-primary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-2xl shadow-[#0A3D2A]/40"
              >
                Get a Free Quote
              </QuoteFormTrigger>
              <Button
                variant="white"
                size="lg"
                className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5 backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#0A3D2A] transition-all"
                asChild
              >
                <Link href="/product">
                  Browse Solutions
                </Link>
              </Button>
              <Button
                variant="heroOutline"
                size="lg"
                className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5"
                asChild
              >
                <a href="tel:+919708989937">
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
