import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Container, Coffee, Truck, Shield, Users, ArrowRight } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: 'Porta Cabins',
      href: '/product/porta-cabins',
      qualifier: 'The standard welded-steel cabin range — site offices and rooms, 9 sizes, delivered in 7–21 working days.',
    },
    {
      icon: Truck,
      title: 'Portable Cabin',
      href: '/product/portable-cabin',
      qualifier: 'Cabins engineered to lift, relocate and reuse across sites — choose this when the unit will move.',
    },
    {
      icon: Building2,
      title: 'Portable Office',
      href: '/product/portable-office',
      qualifier: 'Fitted office cabins — workstations, electricals and AC provision, working from day one.',
    },
    {
      icon: Container,
      title: 'Container Offices',
      href: '/product/container-offices',
      qualifier: 'Container-form and converted ISO offices for industrial duty, yards and hard sites.',
    },
    {
      icon: Container,
      title: 'Container Houses',
      href: '/product/container-houses',
      qualifier: 'Container-format homes — studios to full residences built from container modules.',
    },
    {
      icon: Building2,
      title: 'Prefabricated Houses',
      href: '/product/prefabricated-houses',
      qualifier: 'Panel-built prefab homes and bunkhouses — residential builds that are not container-based.',
    },
    {
      icon: Coffee,
      title: 'Container Cafe',
      href: '/product/container-cafe',
      qualifier: 'Cafes, restaurants and food-truck units built for food businesses.',
    },
    {
      icon: Users,
      title: 'Labour Colony',
      href: '/product/labor-colony',
      qualifier: 'Workforce housing at project scale — colonies, sheds, hutments and camps.',
    },
    {
      icon: Shield,
      title: 'Portable Toilet',
      href: '/product/portable-toilet',
      qualifier: 'Standalone sanitation units — single seaters to multi-cubicle blocks.',
    },
    {
      icon: Building2,
      title: 'Pre-Engineered Buildings',
      href: '/product/pre-engineered-buildings',
      qualifier: 'Steel-framed factories, warehouses and industrial buildings, engineered to span.',
    },
    {
      icon: Building2,
      title: 'Industrial Sheds',
      href: '/product/industrial-sheds',
      qualifier: 'Sheds, garden sheds and prefabricated warehouses.',
    },
    {
      icon: Shield,
      title: 'Security Cabins',
      href: '/product/security-cabins',
      qualifier: 'Guard posts and security kiosks.',
    },
  ];

  return (
    <section className="py-16 md:py-32 bg-white relative" id="products">
      <div className="absolute inset-0 bg-[#F8FAF9]/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            data-homepage-router-heading
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Which SAMAN range is right for you?
          </h2>
          <p
            data-homepage-router-intro
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Every product line below has one definitive page — sizes, specifications and ex-factory prices included. Start where your requirement matches.
          </p>
        </div>

        {/* Intent router */}
        <dl
          data-homepage-range-grid
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.href}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(10,61,42,0.15)] transition-all duration-500 border border-gray-100 flex items-start gap-5 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0A3D2A]/5 to-transparent rounded-bl-full -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500" />

                <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-[#0A3D2A] to-[#1A6B45] rounded-2xl flex items-center justify-center shadow-xl shadow-[#0A3D2A]/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>

                <div className="relative z-10 flex-1">
                  <dt className="text-xl md:text-2xl font-bold text-gray-900 mb-2 transition-colors group-hover:text-[#0A3D2A]">
                    <Link
                      href={service.href}
                      prefetch={false}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D2A] focus-visible:ring-offset-2 after:absolute after:inset-0 after:z-20"
                    >
                      {service.title}
                    </Link>
                  </dt>
                  <dd className="text-gray-600 leading-relaxed font-light">
                    {service.qualifier}
                  </dd>
                </div>

                <ArrowRight className="w-5 h-5 shrink-0 text-[#0A3D2A]/50 mt-1 relative z-10 group-hover:translate-x-1.5 transition-transform" aria-hidden="true" />
              </div>
            );
          })}
        </dl>

        {/* Bottom CTA Block */}
        <div
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
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
