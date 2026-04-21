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
        contain: 'layout style paint'
      }}
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='popLayout'>
          {currentImageIndex === 0 ? (
            <div className="absolute inset-0">
              <Image
                src={heroImages[0].src}
                alt={heroImages[0].alt}
                fill
                priority={true}
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                className="object-cover scale-105"
              />
            </div>
          ) : (
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentImageIndex].src}
                alt={heroImages[currentImageIndex].alt}
                fill
                priority={false}
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto container-padding relative z-20 w-full pt-20 pb-12">
        <div className="hero-grid items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-left-content text-white"
          >
            {/* H1 — Concise, SEO-optimized */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight hero-text-shadow leading-[1.1] text-white"
                style={{
                  contain: 'layout style paint',
                }}
              >
                Premium <span className="text-[#E8F3EF]">Portable Cabins</span> &amp; Container Offices
              </motion.h1>

              {/* Trust badges — refined */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8"
              >
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold text-yellow-400">
                  ISO 9001:2015 Certified
                </span>
                <span className="text-white/40 hidden md:inline">•</span>
                <span className="text-sm md:text-base font-medium text-white/90">21-Day Delivery</span>
                <span className="text-white/40 hidden md:inline">•</span>
                <span className="text-sm md:text-base font-medium text-white/90">25-Year Warranty</span>
              </motion.div>
            </div>

            {/* Paragraph — refined typography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-light"
            >
              India&apos;s leading manufacturer of high-ticket prefab structures for industrial, construction and commercial headquarters. Delivered ready-to-use since 2017.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
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
            </motion.div>
          </motion.div>

          {/* Form Container - Enhanced appearance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-form-container relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0A3D2A] to-emerald-500 rounded-2xl blur opacity-20"></div>
            <div className="relative">
              <QuoteForm variant="hero" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
