import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Building2, Container, Coffee, Truck, Shield, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: 'Portable Cabins',
      tagline: 'Ready to use on arrival',
      description: 'Factory-built cabins for site offices, guard rooms, canteens and accommodation. Manufactured using quality-tested steel and industry-standard processes, 50mm PUF insulation. Delivered and installed at your site.',
      features: ['10×10 ft to 40×12 ft — standard & custom', 'PUF insulation — 8–12°C cooler inside', 'Delivered installed, ready same day'],
      href: '/product/porta-cabins',
      buttonText: 'See Portable Cabins',
      price: 'From ₹1.45 Lakh',
    },
    {
      icon: Container,
      title: 'Container Offices',
      tagline: 'Professional workspace, delivered',
      description: 'Shipping containers converted into fully finished offices and site headquarters. AC, wiring, furniture — all fitted at our factory. Arrives turnkey.',
      features: ['20ft & 40ft container sizes', 'AC, wiring, lighting & furniture fitted', 'Indistinguishable from permanent offices'],
      href: '/product/container-offices',
      buttonText: 'See Container Offices',
      price: 'From ₹3.35 Lakh',
    },
    {
      icon: Shield,
      title: 'Security Cabins',
      tagline: 'Install in hours, not days',
      description: 'Compact guard rooms for gates, societies and factory entrances. FRP (lightweight) or MS steel (heavy-duty). No foundation required.',
      features: ['4×4 ft to 8×8 ft sizes available', 'FRP or MS steel — choose material', 'No foundation — install in hours'],
      href: '/product-category/porta-cabins',
      buttonText: 'See Security Cabins',
      price: 'From ₹75,000',
    },
    {
      icon: Users,
      title: 'Labour Colonies',
      tagline: 'Full camp setup within days',
      description: 'Modular bunk houses and labour accommodation for construction sites. Individual units or multi-storey. Toilet, ventilation and lighting included.',
      features: ['Single units or multi-floor camps', 'Toilet, ventilation & lighting included', 'Full worksite camp in days'],
      href: '/product-category/labor-colony',
      buttonText: 'See Labour Colony Options',
      price: 'Custom pricing',
    },
    {
      icon: Coffee,
      title: 'Container Café',
      tagline: 'Open for business, immediately',
      description: 'Custom container cafés and kiosks for restaurants, retail and events. Full build: exterior branding, plumbing, electrical — delivered ready to open.',
      features: ['Custom branding & signage ready', 'Plumbing & electrical fitted before delivery', 'Relocatable — move any time'],
      href: '/product/container-cafe',
      buttonText: 'See Container Café',
      price: 'Custom pricing',
    },
    {
      icon: Truck,
      title: 'Rental Services',
      tagline: 'No commitment, full flexibility',
      description: 'Short and long-term rentals across Bangalore, Delhi NCR, Hyderabad, Chennai, Pune and Mumbai. Delivery, installation and pickup all included.',
      features: ['Monthly rentals from ₹8,000', 'Delivery, install & pickup included', '15+ cities and major project locations'],
      href: '/rental-services',
      buttonText: 'Enquire About Rental',
      price: 'From ₹8,000/month',
    },
  ];

  return (
    <section className="py-16 md:py-32 bg-white relative" id="products">
      <div className="absolute inset-0 bg-[#F8FAF9]/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
          >
            <Building2 className="w-3.5 h-3.5" />
            Product Portfolio
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Premium Modular <span className="text-[#0A3D2A]">Architecture</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Engineering precision and high-ticket finishes for construction, industrial and corporate headquarters across India.
          </motion.p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(10,61,42,0.15)] transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0A3D2A]/5 to-transparent rounded-bl-full -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500" />

                {/* Icon + price row */}
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0A3D2A] to-[#1A6B45] rounded-2xl flex items-center justify-center shadow-xl shadow-[#0A3D2A]/20 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#0A3D2A]/40 uppercase tracking-widest mb-1">Starting Price</span>
                    <span className="text-sm font-bold text-[#0A3D2A] bg-[#0A3D2A]/10 px-3 py-1.5 rounded-lg">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Title + tagline */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1.5 transition-colors group-hover:text-[#0A3D2A]">
                    {service.title}
                  </h3>
                  <p className="text-xs font-bold text-[#0A3D2A]/60 uppercase tracking-[0.2em] mb-4">
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
                        <div className="w-5 h-5 rounded-full bg-[#0A3D2A]/5 flex items-center justify-center mr-3 mt-0.5 group-hover/item:bg-[#0A3D2A]/10 transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-[#0A3D2A]" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link href={service.href} prefetch={false} className="mt-auto relative z-10">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#0A3D2A]/10 text-[#0A3D2A] font-bold hover:bg-[#0A3D2A] hover:border-[#0A3D2A] hover:text-white transition-all duration-300 h-14 rounded-2xl group/btn text-base"
                  >
                    View Specifications
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 p-8 md:p-12 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-[#051F15] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
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
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
