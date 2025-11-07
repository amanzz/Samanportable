import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Container, Coffee, Truck } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: 'Porta Cabins',
      description: 'High-quality portable cabins for offices, accommodation, and temporary structures.',
      features: ['Customizable sizes', 'Quick installation', 'Durable materials'],
      href: '/product-category/porta-cabins'
    },
    {
      icon: Container,
      title: 'Container Offices',
      description: 'Modern office solutions built from shipping containers with full amenities.',
      features: ['Professional appearance', 'Climate controlled', 'Modular design'],
      href: '/product-category/container-offices'
    },
    {
      icon: Coffee,
      title: 'Container Cafe',
      description: 'Innovative cafe solutions built from shipping containers with modern amenities.',
      features: ['Stylish design', 'Quick setup', 'Mobile friendly'],
      href: '/product-category/container-cafe'
    },
    {
      icon: Truck,
      title: 'Rental Services',
      description: 'Flexible rental options for temporary construction and event needs.',
      features: ['Short-term rentals', 'Delivery included', 'Maintenance support'],
      href: '/rental-services'
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive portable office solutions tailored to your specific needs. 
            From design to installation, we handle everything with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={service.href}>
                <Button variant="outline" className="w-full border-[#0A3D2A] text-[#0A3D2A] hover:bg-[#0A3D2A]/10 hover:border-[#0A3D2A] transition-colors">
                  Learn More
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/product">
            <Button size="lg" className="btn-primary">
               View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

