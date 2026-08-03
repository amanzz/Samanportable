import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const ServicesSection = () => {
  const services = [
    {
      title: 'Portable Cabins',
      tagline: 'Ready to use on arrival',
      description: 'Factory-built cabins for site offices, guard rooms, canteens and accommodation. Manufactured using quality-tested steel and industry-standard processes, 50mm PUF insulation. Delivered and installed at your site.',
      features: ['10×10 ft to 40×12 ft, standard & custom', 'PUF insulation: 8–12°C cooler inside', 'Delivered installed, ready same day'],
      href: '/product/porta-cabins',
      buttonText: 'See Portable Cabins',
      price: 'From ₹1.38 Lakh',
      image: '/homepage/cards/ms-corrugated-portable-cabin-site-office.webp',
      alt: 'New MS corrugated portable cabin site office with grilled windows and AC unit at an Indian construction site',
    },
    {
      title: 'Container Offices',
      tagline: 'Professional workspace, delivered',
      description: 'Shipping containers converted into fully finished offices and site headquarters. AC, wiring, furniture, all fitted at our factory. Arrives turnkey.',
      features: ['20ft & 40ft container sizes', 'AC, wiring, lighting & furniture fitted', 'Indistinguishable from permanent offices'],
      href: '/product/container-offices',
      buttonText: 'See Container Offices',
      price: 'From ₹1.60 Lakh',
      image: '/homepage/cards/container-office-20ft-construction-site.webp',
      alt: 'New 20 ft container office with grilled windows and AC unit installed at an Indian project site',
    },
    {
      title: 'Security Cabins',
      tagline: 'Install in hours, not days',
      description: 'Compact guard rooms for gates, societies and factory entrances. FRP (lightweight) or MS steel (heavy-duty). No foundation required.',
      features: ['4×4 ft to 8×8 ft sizes available', 'FRP or MS steel: choose material', 'No foundation, install in hours'],
      href: '/product/security-cabins',
      buttonText: 'See Security Cabins',
      price: 'From ₹75,000',
      image: '/homepage/cards/security-guard-cabin-factory-gate.webp',
      alt: 'Compact MS steel security guard cabin with grilled observation windows at a factory gate in India',
    },
    {
      title: 'Labour Colonies',
      tagline: 'Full camp setup within days',
      description: 'Modular bunk houses and labour accommodation for construction sites. Individual units or multi-storey. Toilet, ventilation and lighting included.',
      features: ['Single units or multi-floor camps', 'Toilet, ventilation & lighting included', 'Full worksite camp in days'],
      href: '/product/labor-colony',
      buttonText: 'See Labour Colony Options',
      price: 'Price on request, send enquiry',
      image: '/homepage/cards/labour-colony-prefab-worker-accommodation.webp',
      alt: 'Rows of new prefab labour colony units with walkway and drainage at an Indian construction project',
    },
    {
      title: 'Container Café',
      tagline: 'Open for business, immediately',
      description: 'Custom container cafés and kiosks for restaurants, retail and events. Full build: exterior branding, plumbing, electrical, delivered ready to open.',
      features: ['Custom branding & signage ready', 'Plumbing & electrical fitted before delivery', 'Relocatable, move any time'],
      href: '/product/container-cafe',
      buttonText: 'See Container Café',
      price: 'From ₹2.04 Lakh',
      image: '/homepage/cards/container-cafe-food-outlet-service-window.webp',
      alt: 'Modern container café with fold-up service window, counter and outdoor seating at golden hour',
    },
    {
      title: 'Rental Services',
      tagline: 'No commitment, full flexibility',
      description: 'Short and long-term rentals across Bangalore, Delhi NCR, Hyderabad, Chennai, Pune and Mumbai. Delivery, installation and pickup all included.',
      features: ['Monthly rentals from ₹8,000', 'Delivery, install & pickup included', '15+ cities and major project locations'],
      href: '/rental-services',
      buttonText: 'Enquire About Rental',
      price: 'From ₹8,000/month',
      image: '/homepage/cards/portable-cabin-rental-delivery-crane.webp',
      alt: 'Portable cabin delivered by crane at an Indian worksite with riggers guiding from a safe distance',
    },
  ];

  return (
    <section className="py-16 md:py-32 bg-white relative" id="products">
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--ds-surface-alt)_50%,transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color-mix(in_srgb,var(--ds-surface-inverse)_5%,transparent)] text-[var(--ds-surface-inverse)] font-bold text-xs uppercase tracking-widest mb-6 border border-[color-mix(in_srgb,var(--ds-surface-inverse)_10%,transparent)]"
          >
            <Building2 className="w-3.5 h-3.5" />
            Product Portfolio
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Premium Modular <span className="text-[var(--ds-surface-inverse)]">Architecture</span>
          </h2>
          <p
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Engineering precision and high-ticket finishes for construction, industrial and corporate headquarters across India.
          </p>
        </div>

        {/* Product cards — image-top layout (T2.2). Equal heights per row via flex + mt-auto. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl md:rounded-[2.5rem] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Image (4:3 crop of the 1:1 source) with price chip on the image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={service.image}
                  unoptimized={shouldBypassOptimizer(service.image)}
                  alt={service.alt}
                  width={800}
                  height={800}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-3 left-3 rounded-xl bg-[var(--ds-surface-inverse)] px-3 py-2 shadow-lg">
                  <span className="block text-[9px] font-black uppercase tracking-widest text-white/70 leading-none mb-0.5">Starting Price</span>
                  <span className="block text-sm font-bold text-white leading-none">{service.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <Link
                  href={service.href}
                  prefetch={false}
                  className="mb-1.5 block text-2xl font-bold text-gray-900 transition-colors group-hover:text-[var(--ds-surface-inverse)]"
                >
                  {service.buttonText}
                </Link>
                <p className="text-xs font-bold text-[color-mix(in_srgb,var(--ds-surface-inverse)_60%,transparent)] uppercase tracking-[0.2em] mb-4">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed font-light">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-10">
                  {service.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start text-sm text-gray-700 group/item">
                      <div className="w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--ds-surface-inverse)_5%,transparent)] flex items-center justify-center mr-3 mt-0.5 group-hover/item:bg-[color-mix(in_srgb,var(--ds-surface-inverse)_10%,transparent)] transition-colors">
                        <CheckCircle2 className="w-3 h-3 text-[var(--ds-surface-inverse)]" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={service.href} prefetch={false} className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[color-mix(in_srgb,var(--ds-surface-inverse)_10%,transparent)] text-[var(--ds-surface-inverse)] font-bold hover:bg-[var(--ds-surface-inverse)] hover:border-[var(--ds-surface-inverse)] hover:text-white transition-all duration-300 h-14 rounded-2xl group/btn text-base"
                  >
                    View Specifications
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div
          className="mt-16 md:mt-24 p-8 md:p-12 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-[var(--ds-surface-inverse)] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Need a custom technical drawing?</h3>
            <p className="text-white/60 font-light">Our engineers provide custom layouts within 48 hours for serious inquiries.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
            <Link href="/product" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base rounded-2xl font-bold transition-all hover:scale-105"
              >
                Explore Catalog
              </Button>
            </Link>
            <QuoteFormTrigger
              size="lg"
              className="w-full border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-base rounded-2xl transition-all font-bold backdrop-blur-sm"
            >
              Request Layout
            </QuoteFormTrigger>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
