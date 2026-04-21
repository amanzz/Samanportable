import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QuoteFormTrigger from './QuoteFormTrigger';

const faqs = [
  {
    question: 'How much does a portable cabin cost in India?',
    answer:
      'Prices start at ₹1,45,000 for a 10×10 ft security cabin. Standard site offices (10×20 ft) from ₹2,55,000. Large container offices (40×10 ft) range ₹3,35,000–₹5,00,000. Per sq ft cost: ₹900–₹2,500 depending on spec and fittings. We provide a fixed-price quote within 48 hours — no hidden charges.',
  },
  {
    question: 'What is the difference between a portable cabin and a prefab structure?',
    answer:
      'A portable cabin is fully assembled at the factory and delivered ready to use — relocatable at any time. "Prefab structure" is a broader term covering portable cabins, container offices, and modular buildings. All Saman Portable products are prefabricated — built in our factory, not on your site.',
  },
  {
    question: 'What materials are used in Saman Portable structures?',
    answer:
      'ISI-certified MS steel frame (1.2–2.0 mm thickness), 50mm PUF-insulated sandwich panels with 0.50mm PPGI cladding, galvanised steel roofing, and 18mm cement particle board flooring. EPS, Rockwool and Glasswool insulation options available on request.',
  },
  {
    question: 'What sizes are available? Can I get a custom size?',
    answer:
      'Standard sizes: 10×10 ft, 10×14 ft, 10×20 ft, 20×10 ft, 30×10 ft, 40×10 ft, 40×12 ft. Custom sizes available at no extra charge — we design to your site requirements. Custom orders of 1–5 units delivered within the standard 21-day timeline.',
  },
  {
    question: 'How long does delivery and installation take?',
    answer:
      'Standard orders are delivered and fully installed within 21 calendar days anywhere in India. This includes manufacturing, transport and on-site installation by our own crew. No crane or civil team required on your end — we handle everything.',
  },
  {
    question: 'Can portable cabins withstand Indian weather conditions?',
    answer:
      '50mm PUF insulation reduces interior temperature by 8–12°C. Galvanised steel roof handles up to 3,000mm annual rainfall. Wind-load certified to 200 km/hr. Successfully installed across Kerala (heavy rain), Rajasthan (extreme heat), coastal Karnataka (humidity) and high-altitude sites.',
  },
  {
    question: 'Do you offer portable cabins on rent?',
    answer:
      'Yes. Monthly rental starts from ₹8,000. Available in Bangalore, Delhi NCR, Hyderabad, Chennai, Pune and Mumbai. Delivery, installation and removal are all included in the rental price. Short-term (1–6 months) and long-term (6+ months) contracts available.',
  },
  {
    question: 'What is included inside a standard portable cabin?',
    answer:
      'Electrical wiring, switch boards, LED lighting, fan points and ventilation. Flooring is pre-installed (cement particle board or vinyl). Optional additions: AC points, attached toilet, furniture, partition walls, exterior branding. Everything is fitted at our factory before delivery.',
  },
  {
    question: 'Can I customise the size, interior and exterior?',
    answer:
      'Yes. Size, layout, electrical configuration, number of rooms, attached toilets, exterior colour and company branding are all customisable. We provide a layout drawing for approval before manufacturing begins. No extra charge for custom dimensions on orders of 1–5 units.',
  },
  {
    question: 'Do you deliver and install across all of India?',
    answer:
      'Yes. We manufacture in Bengaluru (Karnataka) and Greater Noida (UP), and deliver to 15+ states: Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Maharashtra, Goa, Gujarat, Rajasthan, Delhi NCR, UP, Haryana, Punjab, West Bengal, Odisha and more.',
  },
  {
    question: 'How do I get a quote? How quickly will you respond?',
    answer:
      'Three ways: (1) Fill the quote form on this website — response within 24 hours. (2) Call +91 88616 22859 (Bangalore) or +91 8796039938 (Delhi NCR). (3) WhatsApp us — typically under 2 hours on weekdays. You receive a fixed-price quote with layout drawing within 48 hours.',
  },
];

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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Insights & <span className="text-[#0A3D2A]">Information</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 leading-relaxed font-light"
          >
            Expert answers to the most common questions about India&apos;s leading modular solutions.
          </motion.p>
        </div>

        {/* FAQ accordion - Enhanced */}
        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
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
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA block - Standardized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A3D2A]/5 rounded-bl-full pointer-events-none" />
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Still have questions?
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
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
