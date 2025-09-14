import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const PortaCabin40x10Rental = () => {
  const features = [
    'Spacious 40x10 ft interior layout',
    'High-quality steel construction',
    'Insulated walls and roof',
    'Electrical wiring and lighting',
    'Ventilation system',
    'Security features',
    'Easy installation and removal',
    'Customizable interior options'
  ];

  const specifications = [
    { label: 'Dimensions', value: '40 ft × 10 ft × 8 ft' },
    { label: 'Floor Area', value: '400 sq ft' },
    { label: 'Material', value: 'Premium steel with insulation' },
    { label: 'Weight', value: 'Approx. 2,500 kg' },
    { label: 'Installation Time', value: '4-6 hours' },
    { label: 'Minimum Rental', value: '1 month' }
  ];

  const rentalTerms = [
    { title: 'Flexible Rental Duration', description: 'Short-term is 6 months minimum and long-term is one year or more.' },
    { title: 'Security Deposits', description: '2 lakhs within Bangalore and 2.5 lakhs outside Bangalore.' },
    { title: 'No Rent Deduction', description: 'No rent deduction from the deposit.' },
    { title: 'Delivery and Setup', description: 'Transportation co sides, loading and unloading are born by client.' },
    { title: 'Deposit Refund', description: 'Deposit would be 100% refunded one material reach safely to factory. If any damage, we will deduct from deposit after mutual understanding.' }
  ];

  return (
    <Layout>
      <Head>
        <title>40x10 Porta Cabin Rental - Saman Portable Office Solutions</title>
        <meta name="description" content="Rent 40x10 ft porta cabins in Bangalore. High-quality, spacious portable cabins perfect for offices, accommodation, and temporary structures. Flexible rental terms available." />
      </Head>
      
      <div className="min-h-screen bg-background">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                40×10 Porta Cabin Rental
              </h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
                Spacious and comfortable portable cabins perfect for temporary offices, accommodation, 
                and construction site facilities. Available for short and long-term rentals across Bangalore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger size="lg" className="bg-white text-[#0A3D2A] hover:bg-gray-100 px-8 py-4 text-lg">
                  Get Quote Now
                </QuoteFormTrigger>
                <Button variant="heroOutline" size="lg" className="px-8 py-4 text-lg">
                  View Gallery
                </Button>
              </div>
            </div>
          </section>

          {/* Back Navigation */}
          <section className="py-6 bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <Link href="/rental-services">
                <Button variant="outline" size="sm" className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-[#0A3D2A]/30 hover:bg-[#0A3D2A]/10 text-slate-700 hover:text-[#0A3D2A] transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Rental Services</span>
                </Button>
              </Link>
            </div>
          </section>

          {/* Product Overview */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Premium 40×10 Porta Cabin
                  </h2>
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 15, 2025
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    Our 40×10 porta cabins are designed for maximum comfort and functionality. 
                    Perfect for temporary offices, accommodation, construction site facilities, 
                    and any application requiring a large, portable space.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <QuoteFormTrigger size="lg" className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 px-8 py-4 text-lg">
                      Request Quote
                    </QuoteFormTrigger>
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                      Download Brochure
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-2xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden mb-6">
                    <Image 
                      src="/Porta Cabins In Bangalore (1).jpg" 
                      alt="40×10 Porta Cabin"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="font-semibold text-slate-700">Availability:</span>
                      <span className="text-green-600 font-semibold">In Stock</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="font-semibold text-slate-700">Setup Time:</span>
                      <span className="text-slate-600">4-6 hours</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-semibold text-slate-700">Minimum Rental:</span>
                      <span className="text-slate-600">6 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Technical Specifications
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Detailed specifications and dimensions of our 40×10 porta cabin rental units.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specifications.map((spec, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2">{spec.label}</h3>
                    <p className="text-lg text-[#0A3D2A] font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Terms */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Rental Terms
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Clear and transparent rental terms designed to provide flexibility and security for our clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rentalTerms.map((term, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-xl font-semibold text-foreground mb-3 text-[#0A3D2A]">
                      {term.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Applications */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Perfect For
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our 40×10 porta cabins are versatile solutions for various applications and industries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-[#0A3D2A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Construction Sites</h3>
                  <p className="text-muted-foreground">
                    Site offices, labor accommodation, storage facilities, and security cabins for construction projects.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-[#0A3D2A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Temporary Offices</h3>
                  <p className="text-muted-foreground">
                    Business expansion, project offices, training centers, and temporary workspace solutions.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-[#0A3D2A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Events & Exhibitions</h3>
                  <p className="text-muted-foreground">
                    Event management offices, exhibition booths, registration centers, and temporary facilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rental Process */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  How to Rent
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Simple 4-step process to get your porta cabin rental started.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Contact Us</h3>
                  <p className="text-muted-foreground">
                    Call or email us with your requirements and preferred rental period.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Site Visit</h3>
                  <p className="text-muted-foreground">
                    Our team will visit your site to assess requirements and provide recommendations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Agreement</h3>
                  <p className="text-muted-foreground">
                    Sign the rental agreement and make the initial payment to confirm your booking.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Installation</h3>
                  <p className="text-muted-foreground">
                    We&apos;ll deliver and install your porta cabin within 4-6 hours of arrival.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-[#0A3D2A] text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Rent Your 40×10 Porta Cabin?
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Get in touch with us today for a customized quote and quick setup. 
                Available for immediate rental across Bangalore and surrounding areas.
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

export const getStaticProps = async () => {
  return {
    props: {}
  };
};

export default PortaCabin40x10Rental;

