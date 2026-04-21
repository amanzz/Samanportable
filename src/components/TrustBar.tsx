import React from 'react';
import { Calendar, Factory, Truck, ShieldCheck, Award } from 'lucide-react';

const TrustBar = () => {
  const stats = [
    {
      icon: Award,
      value: 'ISO 9001:2015',
      label: 'Certified Manufacturer',
      accent: true,
    },
    {
      icon: Calendar,
      value: 'Since 2017',
      label: '8+ Years Experience',
    },
    {
      icon: Factory,
      value: '2 Factories',
      label: 'Bengaluru & Greater Noida',
    },
    {
      icon: Truck,
      value: '21-Day Delivery',
      label: 'Order to Installation',
    },
    {
      icon: ShieldCheck,
      value: '25-Year Warranty',
      label: 'Structural Guarantee',
    },
  ];

  return (
    <section className="bg-white border-b border-gray-100 shadow-sm relative z-30">
      {/* Top accent strip */}
      <div className="h-1 bg-gradient-to-r from-[#0A3D2A] via-[#1A6B45] to-[#0A3D2A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center relative px-2 md:px-6 group transition-all duration-300 hover:-translate-y-1 ${
                  stat.accent ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                {/* Vertical divider (desktop only, not for first item) */}
                {index > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-100" />
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                    stat.accent
                      ? 'bg-gradient-to-br from-[#0A3D2A] to-[#1A6B45] text-white shadow-md'
                      : 'bg-[#F0F7F4] text-[#0A3D2A]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div
                  className={`text-lg md:text-xl font-bold leading-tight mb-1 transition-colors duration-300 ${
                    stat.accent ? 'text-[#0A3D2A]' : 'text-gray-900'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-medium leading-tight max-w-[140px]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
