import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import QuoteFormTrigger from './QuoteFormTrigger';

const CTAStrip = () => {
  return (
    <section
      className="py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-[#0A3D2A] to-[#051F15]"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Availability Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/90 text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Support Active: Mon–Sat, 9am–6pm IST
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]"
        >
          Engineered for Performance. <br className="hidden md:block" />
          <span className="text-emerald-400">Built for Growth.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Experience zero-compromise modular solutions. From custom technical drawings to nationwide delivery, we handle the complexity while you scale your business.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center mb-12"
        >
          <QuoteFormTrigger
            size="lg"
            className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5 h-auto rounded-2xl font-black shadow-2xl transition-all hover:scale-105 bg-white text-[#0A3D2A] hover:bg-gray-100 group"
          >
            Get a Free Quote
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform" />
          </QuoteFormTrigger>
          <a href="tel:+918861622859" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5 h-auto rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 bg-transparent transition-all hover:scale-105 w-full backdrop-blur-sm"
            >
              <Phone className="w-5 h-5 mr-3" />
              Call +91 88616 22859
            </Button>
          </a>
        </motion.div>

        {/* Secondary Contact Channels */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm font-medium"
        >
          <a
            href="https://wa.me/918861622859"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <MessageSquare className="w-4 h-4" />
            </div>
            WhatsApp: Reply under 2 hours
          </a>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <Link
            href="/contact"
            className="text-white/40 hover:text-white transition-colors flex items-center gap-2"
          >
            Detailed Inquiry Form
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAStrip;
