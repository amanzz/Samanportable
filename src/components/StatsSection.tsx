import React from 'react';
import { Building2, Users, Package, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Building2,
      count: '5000+',
      label: 'Projects Completed'
    },
    {
      icon: Users,
      count: '3000+',
      label: 'Happy Clients'
    },
    {
      icon: Package,
      count: '200+',
      label: 'Product Range'
    },
    {
      icon: Clock,
      count: '15+',
      label: 'Years Experience'
    }
  ];

  return (
    <section className="py-16 bg-[#082F20]">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.count}
              </div>
              <div className="text-sm md:text-base text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
