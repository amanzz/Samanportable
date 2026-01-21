import React from 'react';
import { CheckCircle, Shield, Clock, Award, Users, Truck, ArrowRight, Compass, Settings, Factory, ClipboardList, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';
import Link from 'next/link';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every cabin is manufactured under 52 in-house quality checkpoints using German-engineered PUF panels and ISI-certified steel for precision and reliability.'
    },
    {
      icon: Clock,
      title: 'Quick Delivery',
      description: 'Our 21-day delivery model—40% faster than the industry average—ensures you get fully finished modular spaces without delays.'
    },
    {
      icon: Shield,
      title: 'Durability',
      description: 'Each structure carries a 25-year structural warranty and withstands 200 km/hr wind loads, ensuring long-term performance in any climate.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'A skilled team of certified engineers, designers, and technicians brings 8+ years of experience in modular and prefab innovation.'
    },
    {
      icon: Truck,
      title: 'Installation Service',
      description: 'We handle everything—from foundation setup to on-site installation—for a seamless, ready-to-use experience anywhere in India.'
    },
    {
      icon: CheckCircle,
      title: 'Customer Support',
      description: 'Our 24/7 customer success team offers real-time project tracking, maintenance, and post-installation assistance to keep your operations running smoothly.'
    }
  ];

  const processSteps = [
    {
      icon: Compass,
      title: 'Consultation & Design',
      description: 'We begin with a detailed project discussion to understand your purpose, budget, and site conditions. Our design experts use 3D BIM modeling and structural analysis to visualize your perfect cabin before production.'
    },
    {
      icon: Settings,
      title: 'Material Selection',
      description: 'Only ISI-certified steel, PUF panels, and fire-resistant insulation make it through our material audit. Each component is chosen for performance, sustainability, and long-term durability.'
    },
    {
      icon: Factory,
      title: 'Manufacturing & Check',
      description: 'At our Bangalore facility, automated cutting and precision welding robots ensure ±2 mm accuracy. Every unit passes through 52 internal inspections under ISO 9001:2015 protocols.'
    },
    {
      icon: Truck,
      title: 'Delivery & Installation',
      description: 'Your modular structure is shipped and installed within 21 days. Our team manages on-site setup, foundation alignment, and finishing for immediate occupancy.'
    },
    {
      icon: ClipboardList,
      title: 'Final Inspection & Handover',
      description: 'Before handover, our engineers perform a full structural, electrical, and safety audit. Only after client approval do we certify the project as complete.'
    },
    {
      icon: Wrench,
      title: 'Lifetime Support',
      description: 'Our service team provides 24/7 maintenance, upgrades, and warranty support throughout your cabin’s lifecycle. With Saman Portable, your investment stays protected for decades.'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-green-50/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm tracking-wide uppercase">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            India’s Next-Generation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A3D2A] to-[#145C41]">Modular Space Innovator</span>
          </h2>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative mb-24">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A3D2A] text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
              Engineering Success Stories
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-900 text-lg">
                  Beyond Building Cabins, We Engineer Success Stories.
                </p>
                <p>
                  At Saman Portable, we redefine modular construction through precision, technology, and trust. Since 2016, we’ve delivered 500+ high-performance portable cabins and container offices across 15+ Indian states, earning a 98.7% on-time delivery record.
                </p>
                <p>
                  Our 21-day delivery promise outpaces industry timelines by 40%, powered by automated production lines and 52 quality checkpoints. Each structure is built using German-engineered PUF panels, ISI-marked steel, and European insulation systems, backed by a 25-year structural warranty.
                </p>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The exclusive ThermoShield™ climate system ensures comfort from –20°C to 50°C, reducing energy use by up to 35%. We’re also India’s first manufacturer to integrate IoT-enabled monitoring, allowing real-time tracking through a mobile dashboard.
                </p>
                <p>
                  Certified under ISO 9001:2015 and ISO 14001:2015, we maintain GRIHA-approved sustainability standards. Our carbon-negative approach saves over 2.5 tons of CO₂ per project.
                </p>
                <p className="font-medium text-[#0A3D2A]">
                  Trusted by Tech Mahindra, JSW Steel, and Prestige Group, we remain India’s most awarded prefab brand.
                </p>
              </div>
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0A3D2A] to-[#145C41] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0A3D2A] transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-24">
          <div className="bg-[#0A3D2A] rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Ready to Build Your Space?
              </h3>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed font-light">
                Join 500+ satisfied clients who chose Saman Portable for their modular needs. Get a free consultation and quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold text-[#0A3D2A]">
                  Get Free Quote
                </QuoteFormTrigger>
                <Link href="/gallery">
                  <Button variant="outline" size="lg" className="px-10 py-6 text-lg rounded-xl border-2 border-white text-white hover:bg-white hover:text-[#0A3D2A] bg-transparent transition-all hover:scale-105 font-semibold">
                    View Portfolio
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Our Process Section */}
        <div className="text-center relative">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm tracking-wide uppercase">
            Workflow TO Success
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Process – <span className="text-[#0A3D2A]">Precision at Every Step</span>
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-16 text-lg">
            From concept to completion, every build follows a tested, transparent workflow used by India&apos;s top infrastructure companies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[#0A3D2A]/20 to-transparent z-0"></div>

            {processSteps.map((step, index) => (
              <div key={index} className="relative z-10 group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center group-hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white border-2 border-[#0A3D2A]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-[#0A3D2A] group-hover:bg-[#0A3D2A] transition-all duration-300 relative">
                    <step.icon className="w-7 h-7 text-[#0A3D2A] group-hover:text-white transition-colors duration-300" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-white group-hover:text-[#0A3D2A] transition-all shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

