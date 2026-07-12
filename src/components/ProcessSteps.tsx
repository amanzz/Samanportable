import React from 'react';
import { Phone, ClipboardCheck, Factory, Truck, CheckCircle, Wrench } from 'lucide-react';

// T6 §6 — the existing 6-step process, copy byte-identical to WhyChooseUs, in a
// tighter single-view layout (compact cards, no oversized panel padding).
const ProcessSteps = () => {
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
      description: '5-year structural warranty begins. If anything needs attention — call us. We respond and resolve. Long-term relationship guaranteed.',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color-mix(in_srgb,var(--ds-surface-inverse)_5%,transparent)] text-[var(--ds-surface-inverse)] font-bold text-xs uppercase tracking-widest mb-4 border border-[color-mix(in_srgb,var(--ds-surface-inverse)_10%,transparent)]">
            Our Methodology
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            A Seamless <span className="text-[var(--ds-surface-inverse)]">6-Step Journey</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light">
            We handle the complexity, you handle your business. From initial consultation to final handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[var(--ds-surface-alt)] p-5 transition-all duration-300 hover:border-[color-mix(in_srgb,var(--ds-surface-inverse)_20%,transparent)] hover:shadow-lg"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--ds-surface-inverse)] shadow-md shadow-[color-mix(in_srgb,var(--ds-surface-inverse)_20%,transparent)]">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-lg font-black text-[color-mix(in_srgb,var(--ds-surface-inverse)_20%,transparent)] tabular-nums">{step.step}</span>
                    <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
