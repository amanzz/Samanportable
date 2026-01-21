import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Container, Coffee, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: 'Porta Cabins',
      description: 'High-quality portable cabins for offices, living, or site use.',
      features: ['Custom sizes', 'Quick install', 'Built to last'],
      href: '/product/porta-cabins',
      buttonText: 'Buy Porta Cabin'
    },
    {
      icon: Container,
      title: 'Container Offices',
      description: 'Modern container offices with full amenities and sleek design.',
      features: ['Modular setup', 'Climate-controlled', 'Professional look'],
      href: '/product/container-offices',
      buttonText: 'Buy Container Office'
    },
    {
      icon: Coffee,
      title: 'Container Café',
      description: 'Trendy container cafés crafted for style and mobility.',
      features: ['Elegant design', 'Fast setup', 'Easy to relocate'],
      href: '/product/container-cafe',
      buttonText: 'Buy Container Café'
    },
    {
      icon: Truck,
      title: 'Rental Services',
      description: 'Flexible portable cabin rentals for worksites and events.',
      features: ['Short or long term', 'Delivery included', 'Maintenance support'],
      href: '/rental-services',
      buttonText: 'Book Rental Cabin'
    }
  ];

  return (
    <section className="section-padding bg-gray-50/50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Our Products
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide a full range of portable office solutions tailored to your unique requirements. From design to installation, we manage every step with precision, quality, and care.
            <br className="my-6 block" />
            Our products include portable cabins, container offices, prefab houses, security cabins, labour colonies, and container cafés, all designed for durability and quick setup. Each unit ensures comfort, strength, and custom finishes to meet your exact needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A3D2A] to-[#145C41] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0A3D2A] mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={service.href} className="mt-auto">
                <Button variant="outline" className="w-full border-2 border-[#0A3D2A] text-[#0A3D2A] font-semibold hover:bg-[#0A3D2A] hover:text-white transition-all duration-300 group/btn h-12 text-base">
                  {service.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/product">
            <Button size="lg" className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

