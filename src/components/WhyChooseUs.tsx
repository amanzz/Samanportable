import React from 'react';
import { CheckCircle, Shield, Clock, Award, Users, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from './QuoteFormTrigger';
import Link from 'next/link';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards in materials and construction quality.'
    },
    {
      icon: Clock,
      title: 'Quick Delivery',
      description: 'Fast turnaround times with efficient project management and execution.'
    },
    {
      icon: Shield,
      title: 'Durability',
      description: 'Built to last with premium materials and expert craftsmanship.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced professionals dedicated to delivering excellence.'
    },
    {
      icon: Truck,
      title: 'Installation Service',
      description: 'Complete installation and setup service included with every project.'
    },
    {
      icon: CheckCircle,
      title: 'Customer Support',
      description: '24/7 support and maintenance services for all our products.'
    }
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Saman Portable?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We stand out in the industry with our commitment to quality, innovation, and customer satisfaction. 
            Here&apos;s what makes us your trusted partner for portable office solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {reason.title}
              </h3>
              <p className="text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-[#0A3D2A] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Contact us today for a free consultation and quote on your portable office project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QuoteFormTrigger variant="white" size="lg" className="px-8 py-3">
                Get Free Quote
              </QuoteFormTrigger>
              <Link href="/gallery">
                <Button variant="heroOutline" size="lg" className="px-8 py-3">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

