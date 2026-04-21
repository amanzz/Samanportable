import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, HardHat, Factory, GraduationCap, HeartPulse, UtensilsCrossed, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import QuoteFormTrigger from './QuoteFormTrigger';

const industries = [
  {
    icon: HardHat,
    title: 'Construction & Infrastructure',
    description: 'Site offices, material storage, labour accommodation and security cabins for highway, metro and real estate projects.',
    color: 'bg-green-50 text-[#0A3D2A] border-green-100',
  },
  {
    icon: Factory,
    title: 'Manufacturing & Warehousing',
    description: 'Gate security cabins, quality labs, break rooms and visitor offices for factories and logistics hubs.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Temporary classrooms, staff rooms and admin offices for schools and colleges. Quick setup for capacity expansion.',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare',
    description: 'Sample labs, quarantine units, vaccination centres and triage cabins for hospitals and PHCs.',
    color: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    icon: UtensilsCrossed,
    title: 'Retail & Food Service',
    description: 'Container cafés, kiosks and pop-up retail for QSR chains, restaurants and event organisers. Branding-ready.',
    color: 'bg-green-50 text-[#0A3D2A] border-green-100',
  },
  {
    icon: Shield,
    title: 'Government & Defence',
    description: 'Security checkposts, toll booths, election offices and disaster relief shelters for public agencies.',
    color: 'bg-green-50 text-green-700 border-green-100',
  },
];

const ModularSolutionsSEO = () => {
  return (
    <section className="py-16 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
          >
            <Building2 className="w-3.5 h-3.5" />
            Sectors We Empower
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Built for Every Industry,{' '}
            <span className="text-[#0A3D2A]">Delivered Nationwide</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Engineering robust modular architecture for India&apos;s most demanding project sites and commercial environments.
          </motion.p>
        </div>

        {/* Industry grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(10,61,42,0.15)] transition-all duration-500 group"
              >
                <div className="flex flex-col gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#0A3D2A] group-hover:text-white ${industry.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info strips - Refined */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-[#F8FAF9] to-white p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#0A3D2A]/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A3D2A]/5 rounded-full blur-3xl -translate-y-8 translate-x-8" />
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-12 h-12 bg-white text-[#0A3D2A] rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 border border-[#0A3D2A]/10">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pan-Industry Adaptability</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  From critical healthcare labs to high-traffic retail hubs — our structures are engineered to exceed industry-specific standards and operational requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F8FAF9] to-white p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#0A3D2A]/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A3D2A]/5 rounded-full blur-3xl -translate-y-8 translate-x-8" />
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-12 h-12 bg-white text-[#0A3D2A] rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 border border-[#0A3D2A]/10">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nationwide Capability</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Strategic manufacturing in <span className="font-bold text-[#0A3D2A]">Bengaluru and Greater Noida</span> ensures optimized logistics and rapid deployment across 15+ states.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore link - Standardized */}
        <div className="text-center mb-20">
          <Link
            href="/product"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-50 text-[#0A3D2A] font-bold hover:bg-[#0A3D2A] hover:text-white transition-all duration-300 shadow-sm"
          >
            Explore All Modular Solutions
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Trust banner - Premium Refresh */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-[#0A3D2A] to-[#051F15] px-6 py-10 md:px-16 md:py-16 shadow-[0_30px_60px_-15px_rgba(10,61,42,0.3)]"
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Trusted by 500+ <span className="text-emerald-400">Industry Leaders</span>
              </h3>
              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                Empowering JSW Steel, Tech Mahindra, and Prestige Group with zero-compromise site infrastructure.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <QuoteFormTrigger className="w-full lg:w-auto bg-white text-[#0A3D2A] hover:bg-gray-100 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center group">
                Request a Quote 
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </QuoteFormTrigger>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModularSolutionsSEO;
