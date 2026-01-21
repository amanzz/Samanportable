import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';

// Defer heavy form hydration to reduce LCP render delay
const QuoteForm = dynamic(() => import('./QuoteForm'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[360px] rounded-xl bg-white/5 border border-white/10 animate-pulse"
      style={{
        contain: 'layout style paint',
        contentVisibility: 'auto',
        containIntrinsicSize: '600px 500px'
      }}
    />
  ),
});

const heroImages = [
  {
    src: '/hero-image/saman-portable-office-cabin-bangalore.webp',
    alt: 'Saman Portable Office Cabin in Bangalore - High Quality Site Office'
  },
  {
    src: '/hero-image/premium-container-site-office-rental.webp',
    alt: 'Premium Container Site Office Rental Service by Saman Portable'
  },
  {
    src: '/hero-image/modular-prefab-homes-structures-india.webp',
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
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='popLayout'>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} // Smooth 1.5s transition
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              priority={true} // Priority on for LCP
              className="object-cover"
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark overlay for text readability - Maximum contrast */}
      <div className="absolute inset-0 bg-black/80 z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto container-padding relative z-20 w-full">
        <div className="hero-grid">
          <div className="hero-left-content text-white">
            {/* Critical H1 for LCP - Mobile Optimized */}
            <div className="mb-8">
              <h1
                className="font-bold text-3xl md:text-5xl lg:text-6xl mb-4 tracking-tight hero-text-shadow leading-tight text-white"
                style={{
                  contain: 'layout style paint',
                  contentVisibility: 'auto',
                  willChange: 'auto'
                }}
              >
                Portable Cabins & Container Offices in Bangalore
              </h1>
              <h2
                className="text-xl md:text-2xl lg:text-3xl font-medium text-yellow-400 hero-text-shadow"
              >
                Premium Prefab Solutions by Saman Portable
              </h2>
            </div>

            {/* Optimized paragraph with proper containment */}
            <p
              className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
              style={{
                contain: 'layout style paint',
                contentVisibility: 'auto'
              }}
            >
              Experience India’s fastest-delivered modular cabins, built with MS steel and wooden, eco-smart engineering, and backed by ISO-certified quality. From site offices to luxury prefab homes, we craft durable, relocatable spaces that last.
            </p>

            {/* CTA Buttons - Critical for user interaction */}
            <div
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
              style={{
                contain: 'layout style paint',
                contentVisibility: 'auto'
              }}
            >
              <QuoteFormTrigger
                size="lg"
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                Get Your Quote
              </QuoteFormTrigger>
              <Button
                variant="white"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                asChild
              >
                <Link href="/product" prefetch={false}>
                  View Products
                </Link>
              </Button>
            </div>
          </div>

          {/* Form Container - Deferred to avoid blocking LCP */}
          <div
            className="hero-form-container"
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '600px 500px',
              contain: 'layout style paint'
            }}
          >
            <QuoteForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

