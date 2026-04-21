import React from 'react';
import { Building2, MapPin, Truck, Calendar } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Building2,
      count: '500+',
      label: 'Structures Delivered',
      sublabel: 'Across India since 2017',
    },
    {
      icon: MapPin,
      count: '15+',
      label: 'States Served',
      sublabel: 'Pan-India delivery',
    },
    {
      icon: Truck,
      count: '21-Day',
      label: 'Order to Installation',
      sublabel: 'Guaranteed timeline',
    },
    {
      icon: Calendar,
      count: '8+ Years',
      label: 'Manufacturing Experience',
      sublabel: 'ISO 9001:2015 certified',
    },
  ];

  return (
    <section className="py-14 md:py-16 bg-[#082F20]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-[#082F20] text-center px-6 py-8 md:py-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-1 leading-none">
                  {stat.count}
                </div>
                <div className="text-sm font-semibold text-white/90 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-white/50">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
