import Image, { type ImageLoaderProps } from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';

const heroImage = {
  src: '/hero-image/saman-portable-office-cabin-bangalore-clean.webp',
  mobileSrc: '/hero-image/saman-portable-office-cabin-bangalore-640.webp',
  alt: 'Saman Portable Office Cabin in Bangalore - High Quality Site Office'
};

const heroLoader = ({ src, width }: ImageLoaderProps) => (
  src === heroImage.src && width <= 1080 ? heroImage.mobileSrc : src
);

const HeroSection = () => {
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
            src={heroImage.src}
            loader={heroLoader}
            unoptimized={shouldBypassOptimizer(heroImage.src)}
            alt={heroImage.alt}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover scale-105"
          />
        </div>
      </div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto container-padding relative z-20 w-full pt-20 pb-12">
        <div className="hero-grid items-center">
          <div data-homepage-first-100 className="hero-left-content text-white">
            {/* H1 — Concise, SEO-optimized */}
            <div className="mb-8">
              <h1
                className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight hero-text-shadow leading-[1.1] text-white"
                style={{
                  contain: 'layout style paint',
                }}
              >
                Factory-Built Modular Structures from <span className="text-[#E8F3EF]">Bangalore &amp; Greater Noida</span>
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
            <p
              data-homepage-opening
              className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-light"
            >
              SAMAN POS India Private Limited manufactures factory-built modular structures at its own Bangalore and Greater Noida units — ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified, NSIC-enlisted and DPIIT-recognised. You deal with the maker, not a reseller: every unit is fabricated in-house, delivered complete, and installed on your prepared base. Choose your range below — each product line has its own page with sizes, specifications and ex-factory prices — or send your requirement for a written, itemised quotation.
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
