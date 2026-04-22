import React from 'react';
import { Star, Quote, Building2, CheckCircle } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const ClientsSection = () => {
  const clients = [
    { name: 'Embassy Group', sector: 'Real Estate', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (1).jpeg' },
    { name: 'BHEL', sector: 'Infrastructure & Power', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (2).jpeg' },
    { name: 'BOSCH', sector: 'Engineering & Tech', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (3).jpeg' },
    { name: 'BIAL', sector: 'Aviation', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (4).jpeg' },
    { name: 'Indian Oil', sector: 'Energy & Petrochemicals', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (5).jpeg' },
    { name: 'Bharat Electronics', sector: 'Defense & Electronics', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (6).jpeg' },
    { name: 'Shell', sector: 'Energy & Oil', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (7).jpeg' },
    { name: 'TATA', sector: 'Conglomerate', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (8).jpeg' },
    { name: 'Aditya Birla Group', sector: 'Conglomerate', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09 (9).jpeg' },
    { name: 'AO Smith', sector: 'Manufacturing', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.09.jpeg' },
    { name: 'Mahindra', sector: 'Automotive & Tech', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.10 (1).jpeg' },
    { name: "Domino's", sector: 'Food & Beverage', logo: '/client logo/WhatsApp Image 2026-04-21 at 21.47.10.jpeg' },
    { name: 'URC Construction', sector: 'Infrastructure', logo: '/client logo/WhatsApp Image 2026-04-21 at 22.05.14 (1).jpeg' },
    { name: 'MFAR', sector: 'Infrastructure', logo: '/client logo/WhatsApp Image 2026-04-21 at 22.05.14.jpeg' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      company: 'ABC Construction',
      role: 'Project Director',
      rating: 5,
      project: '12 site office cabins · Karnataka highway project',
      text: 'All 12 cabins delivered within the promised 7–21 days — exactly as scheduled. PUF insulation keeps interiors comfortable even in May. Our engineers moved in the same day.',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      company: 'XYZ Industries',
      role: 'Facilities Manager',
      project: 'Container office · Greater Noida factory',
      rating: 5,
      text: 'Saman handled everything — design, electrical, AC fitting, furniture. The finished office looks like a permanent building. Visitors cannot tell the difference.',
    },
    {
      id: 3,
      name: 'Amit Patel',
      company: 'DEF Enterprises',
      role: 'Operations Head',
      project: 'Rental cabins · 3 sites across Hyderabad & Chennai',
      rating: 5,
      text: 'Renting from Saman for two years across three sites. Monthly rental is transparent — delivery, installation and pickup included. No hidden costs. Reliable every time.',
    },
  ];

  const trustPoints = [
    '500+ structures delivered since 2017',
    'Pan-India delivery across 15+ states',
    'ISO 9001:2015 certified processes',
    '25-year structural warranty on all units',
  ];

  // Duplicate for seamless infinite loop
  const marqueeClients = [...clients, ...clients];

  return (
    <section className="py-16 md:py-28 bg-[#F8FAF9]">
      {/* CSS keyframe for marquee animation */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .clients-marquee-track {
          animation: marquee-scroll 32s linear infinite;
          will-change: transform;
        }
        .clients-marquee-wrapper:hover .clients-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm mb-4">
            <Building2 className="w-4 h-4" />
            Client Trust
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Trusted by Leading{' '}
            <span className="text-[#0A3D2A]">Indian Companies</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            From construction majors to IT companies — businesses across India rely on Saman Portable for modular space.
          </p>
        </div>

        {/* ── Infinite Auto-Scrolling Logo Marquee ── */}
        <div className="mb-10">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Companies We&apos;ve Served
          </p>

          {/* Outer wrapper: overflow hidden + fade edges with CSS mask */}
          <div
            className="clients-marquee-wrapper relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            {/* Scrolling track — contains 2× the logos for a seamless loop */}
            <div
              className="clients-marquee-track flex gap-4"
              style={{ width: 'max-content' }}
            >
              {marqueeClients.map((client, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#0A3D2A]/30 hover:shadow-md transition-all duration-300 group flex-shrink-0"
                  style={{ width: '140px', minHeight: '120px' }}
                >
                  <div className="w-16 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight mb-1">
                    {client.name}
                  </span>
                  <span className="text-[9px] text-gray-400 text-center">{client.sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust points strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
          {trustPoints.map((point, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
              <CheckCircle className="w-4 h-4 text-[#0A3D2A] flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{point}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              {/* Project badge */}
              <div className="text-xs font-semibold text-[#0A3D2A] bg-[#0A3D2A]/8 px-3 py-1 rounded-full mb-4 inline-block w-fit">
                {t.project}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 leading-relaxed text-sm italic flex-grow mb-5 relative">
                <Quote className="w-6 h-6 text-gray-200 absolute -top-1 -left-1" />
                <span className="relative z-10 pl-4">&quot;{t.text}&quot;</span>
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0A3D2A]/10 flex items-center justify-center text-[#0A3D2A] font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <QuoteFormTrigger
            size="lg"
            className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white px-6 md:px-10 py-4 text-sm md:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold h-auto min-h-[60px] whitespace-normal leading-tight"
          >
            Join 500+ Happy Clients — Get a Free Quote
          </QuoteFormTrigger>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
