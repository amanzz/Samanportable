import React from 'react';
import { Ruler, Wrench, Info } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const SpecsTable = () => {
  const technicalSpecs = [
    { label: 'Frame', value: 'ISI-certified Mild Steel (1.2–2.0 mm)' },
    { label: 'Wall Panels', value: '50mm PUF Sandwich Panels (PPGI coated)' },
    { label: 'Roof', value: 'Galvanised Steel Sheet with PUF insulation' },
    { label: 'Flooring', value: '18mm Cement Particle Board / Vinyl' },
    { label: 'Insulation Options', value: 'PUF / EPS / Rockwool / Glasswool' },
    { label: 'Wind Load Rated', value: 'Up to 200 km/hr' },
    { label: 'Temp Reduction', value: '8–12°C below ambient' },
    { label: 'Structural Warranty', value: '25 Years' },
  ];

  const standardSizes = [
    { size: '10×10 ft', area: '100 sq ft', use: 'Security cabin / Guard room' },
    { size: '10×20 ft', area: '200 sq ft', use: 'Site office / Storage' },
    { size: '20×10 ft', area: '200 sq ft', use: 'Office / Canteen' },
    { size: '30×10 ft', area: '300 sq ft', use: 'Multi-room office' },
    { size: '40×10 ft', area: '400 sq ft', use: 'Container office / Lab' },
    { size: '40×12 ft', area: '480 sq ft', use: 'Premium office / Bunk house' },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm mb-4">
            <Wrench className="w-4 h-4" />
            Technical Specifications
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Built to Precise Engineering Standards
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every Saman structure uses certified materials and is tested for Indian climate conditions. Here&apos;s exactly what you get.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* Technical Specifications */}
          <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-5 bg-[#0A3D2A]">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Materials & Ratings</h3>
                <p className="text-xs text-white/70">As per IS standards</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <tbody>
                {technicalSpecs.map((spec, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} border-b border-gray-100 last:border-0`}
                  >
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 w-2/5">
                      {spec.label}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standard Sizes */}
          <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-5 bg-[#0A3D2A]">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Ruler className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Standard Sizes</h3>
                <p className="text-xs text-white/70">Custom dimensions available</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Size</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Area</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Typical Use</th>
                </tr>
              </thead>
              <tbody>
                {standardSizes.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} border-b border-gray-100 last:border-0`}
                  >
                    <td className="px-5 py-3.5 text-sm font-bold text-[#0A3D2A]">
                      {row.size}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {row.area}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {row.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom size note + CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 bg-[#0A3D2A]/5 border border-[#0A3D2A]/15 rounded-2xl px-6 py-5">
          <div className="flex items-start gap-3 flex-1">
            <Info className="w-5 h-5 text-[#0A3D2A] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Need a custom size or spec?</span>{' '}
              We manufacture to your exact dimensions at no extra charge. Custom orders of 1–5 units delivered within the same 21-day timeline.
            </p>
          </div>
          <QuoteFormTrigger
            size="default"
            className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white px-6 py-2.5 text-sm rounded-xl font-semibold whitespace-nowrap shrink-0 transition-all"
          >
            Get Custom Quote
          </QuoteFormTrigger>
        </div>
      </div>
    </section>
  );
};

export default SpecsTable;
