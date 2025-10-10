import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { ArrowRight, Building2, Container, Package, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const RentalServices = () => {
  const rentalServices = [
    {
      id: 1,
      title: '40×10 Porta Cabin Rental',
      description: 'Spacious 400 sq ft porta cabin perfect for large temporary offices, accommodation, and commercial spaces.',
      features: ['400 sq ft', 'High-quality construction', 'Quick setup'],
      link: '/container-rent-services/40x10-porta-cabin-rental'
    },
    {
      id: 2,
      title: '30×10 Porta Cabin Rental',
      description: '300 sq ft porta cabin ideal for medium-scale operations, temporary offices, and accommodation needs.',
      features: ['300 sq ft', 'Professional finish', 'Easy installation'],
      link: '/container-rent-services/30x10-porta-cabin-rental'
    },
    {
      id: 3,
      title: '20×10 Porta Cabin Rental',
      description: '200 sq ft porta cabin perfect for small offices, accommodation, and temporary commercial spaces.',
      features: ['200 sq ft', 'Compact design', 'Cost-effective'],
      link: '/container-rent-services/20x10-porta-cabin-rental'
    },
    {
      id: 4,
      title: '10×10 Porta Cabin Rental',
      description: '100 sq ft porta cabin ideal for individual offices, small accommodation, and temporary structures.',
      features: ['100 sq ft', 'Portable design', 'Quick delivery'],
      link: '/container-rent-services/10x10-porta-cabin-rental'
    },
    {
      id: 5,
      title: '40×8 Container Office Rental',
      description: 'Spacious 320 sq ft container office perfect for large-scale operations and temporary office needs.',
      features: ['320 sq ft', 'Modern amenities', 'Professional appearance'],
      link: '/container-rent-services/40x8-container-office-rental'
    },
    {
      id: 6,
      title: '30×8 Container Office Rental',
      description: '240 sq ft container office ideal for medium-scale operations and temporary office solutions.',
      features: ['240 sq ft', 'Quality construction', 'Flexible layout'],
      link: '/container-rent-services/30x8-container-office-rental'
    },
    {
      id: 7,
      title: '20×8 Container Office Rental',
      description: '160 sq ft container office perfect for small teams and temporary office requirements.',
      features: ['160 sq ft', 'Efficient design', 'Quick setup'],
      link: '/container-rent-services/20x8-container-office-rental'
    },
    {
      id: 8,
      title: '10×8 Container Office Rental',
      description: '80 sq ft container office ideal for individual consultants and compact office spaces.',
      features: ['80 sq ft', 'Compact design', 'Cost-effective'],
      link: '/container-rent-services/10x8-container-office-rental'
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Quick Setup',
      description: 'Fast installation and setup within 24-48 hours'
    },
    {
      icon: <Package className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Flexible Terms',
      description: 'Short-term and long-term rental options available'
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Quality Assured',
      description: 'All units meet industry standards and safety requirements'
    },
    {
      icon: <Container className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Maintenance Included',
      description: 'Regular maintenance and support included in rental'
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="Rental Services - Saman Portable Office Solutions"
        fallbackDescription="Professional rental services for porta cabins, container offices, and prefab structures in Bangalore. Flexible terms and quick setup available."
        fallbackCanonical="https://www.samanportable.com/rental-services"
        keywords="porta cabin rental, container office rental, prefab structure rental, temporary office rental, construction site rental, portable cabin hire"
        author="Saman Portable Office Solutions"
        publisher="Saman Portable Office Solutions"
      />
      
      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Professional Rental Services
              </h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
                Flexible, cost-effective rental solutions for porta cabins, container offices, and prefab structures. 
                Perfect for temporary needs, construction sites, and business expansion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger size="lg" className="bg-white text-[#0A3D2A] hover:bg-gray-100 px-8 py-4 text-lg">
                  Get Quote
                </QuoteFormTrigger>

              </div>
            </div>
          </section>

          {/* Why Choose Our Rental Services */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose Our Rental Services?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  We provide reliable, flexible, and cost-effective rental solutions with unmatched service quality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Services */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Rental Services
                </h2>
                <p className="text-slate-700 mb-4 text-center">
                  <strong>Last updated:</strong> January 15, 2025
                </p>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choose from our comprehensive range of 8 rental solutions designed to meet your specific requirements. Each service is available in multiple sizes and configurations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rentalServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[#0A3D2A] transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-2">Available Sizes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, index) => (
                            <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <Link href={service.link}>
                          <Button size="sm" className="group">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Process */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Simple Rental Process
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Getting started with our rental services is quick and easy. Follow these simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Contact Us
                  </h3>
                  <p className="text-muted-foreground">
                    Get in touch with our team to discuss your requirements and get a quote.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Site Assessment
                  </h3>
                  <p className="text-muted-foreground">
                    Our team will visit your site to assess requirements and provide recommendations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Agreement & Setup
                  </h3>
                  <p className="text-muted-foreground">
                    Sign the rental agreement and we&apos;ll handle the delivery and setup.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Ongoing Support
                  </h3>
                  <p className="text-muted-foreground">
                    We provide maintenance and support throughout your rental period.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Coverage Areas */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Service Coverage Areas
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  We provide rental services across Bangalore and surrounding areas with quick delivery and setup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-[#0A3D2A]" />
                    <h3 className="text-xl font-semibold text-foreground">Bangalore City</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Complete coverage of Bangalore city including all major areas and commercial zones.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Central Business District</li>
                    <li>• IT Corridors</li>
                    <li>• Industrial Areas</li>
                    <li>• Residential Zones</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-[#0A3D2A]" />
                    <h3 className="text-xl font-semibold text-foreground">Greater Bangalore</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Extended coverage to surrounding areas and satellite towns around Bangalore.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Whitefield</li>
                    <li>• Electronic City</li>
                    <li>• Sarjapur Road</li>
                    <li>• Outer Ring Road</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-[#0A3D2A]" />
                    <h3 className="text-xl font-semibold text-foreground">Industrial Areas</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Specialized services for industrial and construction sites across the region.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Peenya Industrial Area</li>
                    <li>• Bommasandra</li>
                    <li>• Doddaballapur</li>
                    <li>• Nelamangala</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-[#0A3D2A] text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Contact us today to discuss your rental requirements and get a customized quote for your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger size="lg" className="bg-white text-[#0A3D2A] hover:bg-gray-100 px-8 py-4 text-lg">
                  Get Free Quote
                </QuoteFormTrigger>
                <Button 
                  variant="heroOutline" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={() => window.location.href = 'tel:+918046809920'}
                >
                  Call Now
                </Button>
              </div>
            </div>
          </section>


        </main>
      </div>
    </Layout>
  );
};

export default RentalServices;

