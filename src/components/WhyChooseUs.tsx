import React from 'react';
import { CheckCircle, Shield, Clock, Award, Users, Truck, ArrowRight, Phone, ClipboardCheck, Factory, Wrench, Headphones, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';
import Link from 'next/link';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: '52 Quality Checkpoints',
      description: 'Every cabin is inspected at 52 stages — from raw material to final wiring test. ISI-certified steel, PUF insulation, no outsourced assembly.',
    },
    {
      icon: Clock,
      title: '21-Day Delivery, Guaranteed',
      description: 'Our own factory, transport and installation crew — no middlemen, no delays. Your space is ready to use on day 21.',
    },
    {
      icon: Shield,
      title: '25-Year Structural Warranty',
      description: 'PUF insulation cuts heat by 8–12°C. Wind-rated to 200 km/hr. Galvanised roof handles heavy monsoon. We back it with a 25-year warranty.',
    },
    {
      icon: Users,
      title: 'Site-Experienced Engineers',
      description: 'Our team has installed on highway projects, factory floors, rooftops and remote sites. We plan for real constraints — not ideal conditions.',
    },
    {
      icon: Truck,
      title: 'We Install It — You Walk In',
      description: 'No crane, no civil team, no coordination stress. We handle levelling, placement, electrical and fit-out. You walk in and start working.',
    },
    {
      icon: Headphones,
      title: 'Support After Delivery',
      description: 'Warranty claims, maintenance, repairs — we respond. Many clients have been with us since 2017. Our relationship continues long after handover.',
    },
  ];

  const processSteps = [
    {
      icon: Phone,
      step: '01',
      title: 'Tell Us What You Need',
      description: 'Call, WhatsApp or fill the form. Share your size, site location and use case. We respond within 24 hours with a fixed-price quote.',
    },
    {
      icon: ClipboardCheck,
      step: '02',
      title: 'We Design for Your Site',
      description: 'Our engineers create a layout based on your dimensions and access. You approve design, spec and price before anything is built.',
    },
    {
      icon: Factory,
      step: '03',
      title: 'Factory Manufacturing',
      description: 'Built at our Bengaluru or Greater Noida facility. Steel cutting, welding, panels, wiring — all under controlled quality conditions.',
    },
    {
      icon: Truck,
      step: '04',
      title: 'Delivery & Installation',
      description: 'Our crew brings your cabin to site and handles placement, levelling, electrical connection and final fit-out. No outside help needed.',
    },
    {
      icon: CheckCircle,
      step: '05',
      title: 'You Inspect & Approve',
      description: 'Walk through with our supervisor. Check every fitting, switch and panel. We fix anything on the spot. Handover on your written approval.',
    },
    {
      icon: Wrench,
      step: '06',
      title: 'Ongoing Support',
      description: '25-year structural warranty begins. If anything needs attention — call us. We respond and resolve. Long-term relationship guaranteed.',
    },
  ];

  return (
    <section className="py-16 md:py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ─── WHY CHOOSE US ─── */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
          >
            Why Choose Saman
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            The B2B Standard for <span className="text-[#0A3D2A]">Portable Solutions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Over 500+ corporate clients trust us for critical site infrastructure. Built to last, delivered on time.
          </motion.p>
        </div>

        {/* Reason cards - Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#F8FAF9] rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-[#0A3D2A]/20 hover:shadow-2xl hover:shadow-[#0A3D2A]/5 transition-all duration-500 group relative"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#0A3D2A] transition-colors duration-500">
                  <Icon className="w-6 h-6 text-[#0A3D2A] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── PROCESS SECTION - Enhanced ─── */}
        <div className="relative pt-12 md:pt-20 pb-12 md:pb-16 px-6 md:px-16 rounded-2xl md:rounded-[3rem] bg-[#0A3D2A]/[0.02] border border-[#0A3D2A]/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A3D2A]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="text-center mb-20 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10">
              Our Methodology
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              A Seamless <span className="text-[#0A3D2A]">6-Step Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
              We handle the complexity, you handle your business. From initial consultation to final handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="flex items-start gap-6 h-full">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#0A3D2A] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0A3D2A]/20 relative z-10">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="w-0.5 flex-grow bg-gradient-to-b from-[#0A3D2A]/20 to-transparent my-2 hidden md:block" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-[#0A3D2A]/10 tabular-nums">
                          {step.step}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#0A3D2A] transition-colors">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           {/* Add partner logos here if available, otherwise just leave the space or use trust labels */}
           <div className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">Trusted by India&apos;s Infrastructure Leaders</div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
