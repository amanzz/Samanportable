import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';
import { homepageFaqs } from '@/data/homepageFaqs';

// T6 §7 — homepage shows the first five FAQs only. The FAQPage JSON-LD
// (getHomepageFAQSchema in src/lib/schema.ts) slices to the same five, so the
// schema always matches visible content (G6). The full homepageFaqs data is kept.
const faqs = homepageFaqs.slice(0, 5);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-32 bg-[#F8FAF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Insights & <span className="text-[#0A3D2A]">Information</span>
          </h2>
          <p
            className="text-lg text-gray-600 leading-relaxed font-light"
          >
            Expert answers to the most common questions about India&apos;s leading modular solutions.
          </p>
        </div>

        {/* FAQ accordion - Enhanced */}
        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl md:rounded-3xl border transition-all duration-500 overflow-hidden ${
                openIndex === index
                  ? 'border-[#0A3D2A]/30 shadow-xl shadow-[#0A3D2A]/5 bg-white'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-6 focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className={`text-base md:text-lg font-bold transition-colors duration-300 pr-4 ${
                  openIndex === index ? 'text-[#0A3D2A]' : 'text-gray-900 group-hover:text-[#0A3D2A]'
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? 'bg-[#0A3D2A] text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-[#0A3D2A]/10 group-hover:text-[#0A3D2A]'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 text-gray-600 leading-relaxed font-light text-base border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA block - Standardized */}
        <div
          className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A3D2A]/5 rounded-bl-full pointer-events-none" />
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Questions we are asked most
          </h3>
          <p className="text-gray-500 mb-8 font-light">
            Our expert consultants are available for personal assistance from 9 AM to 7 PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteFormTrigger
              size="lg"
              className="bg-[#0A3D2A] hover:bg-[#082F20] text-white px-10 py-4 rounded-2xl font-black text-base shadow-xl shadow-[#0A3D2A]/20 transition-all"
            >
              Send an Enquiry
            </QuoteFormTrigger>
            <a
              href="tel:+918861622859"
              className="inline-flex items-center justify-center gap-3 border-2 border-[#0A3D2A]/10 text-[#0A3D2A] hover:bg-[#0A3D2A] hover:text-white px-10 py-4 rounded-2xl font-bold text-base transition-all bg-white"
            >
              Call +91 88616 22859
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
