import React from 'react';
import dynamic from 'next/dynamic';
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

const HeroSection = () => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-section-responsive"
      style={{ 
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}
    >
      <div className="absolute inset-0 z-0 bg-[#082F20]"></div>
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="max-w-7xl mx-auto container-padding relative z-20 w-full">
        <div className="hero-grid">
          <div className="hero-left-content text-white">
            {/* Critical H1 for LCP - Mobile Optimized with system font fallback */}
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 hero-text-shadow leading-tight mobile-lcp-optimized"
              style={{ 
                contain: 'layout style paint',
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto 1.2em',
                willChange: 'auto',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Premium Portable Office Solutions
            </h1>
            
            {/* Optimized paragraph with proper containment and system font fallback */}
            <p 
              className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-2xl leading-relaxed"
              style={{ 
                contain: 'layout style paint',
                contentVisibility: 'auto',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Leading provider of portable cabins, container offices, and prefab solutions in Bangalore. 
              Quality, durability, and innovation in portable construction.
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

