import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const ContainerOffice20x8Rental = () => {
  const features = [
    "Compact 160 sq ft interior space",
    "High-quality steel construction",
    "Insulated walls and roof",
    "Multiple windows for natural light",
    "Electrical fittings and lighting",
    "Ventilation system",
    "Fire-resistant materials",
    "Easy assembly and disassembly"
  ];

  const specifications = [
    { label: "Dimensions", value: "20' x 8' x 8.5'" },
    { label: "Floor Area", value: "160 sq ft" },
    { label: "Wall Height", value: "7.5' (internal)" },
    { label: "Material", value: "Galvanized Steel" },
    { label: "Insulation", value: "50mm PUF" },
    { label: "Windows", value: "2 units" },
    { label: "Doors", value: "1 main entrance" },
    { label: "Weight", value: "Approx. 2 tons" }
  ];

  const rentalTerms = [
    { title: 'Flexible Rental Duration', description: 'Short-term is 6 months minimum and long-term is one year or more.' },
    { title: 'Security Deposits', description: '1 lakhs within Bangalore and 1.5 lakhs outside Bangalore.' },
    { title: 'No Rent Deduction', description: 'No rent deduction from the deposit.' },
    { title: 'Delivery and Setup', description: 'Transportation cost, both sides, loading and unloading are born by client.' },
    { title: 'Deposit Refund', description: 'Deposit would be 100% refunded one material reach safely to factory. If any damage, we will deduct from deposit after mutual understanding.' }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="20x8 Container Office Rental - Saman Portable Office Solutions"
        fallbackDescription="Rent 20x8 ft container offices in Bangalore. Compact, high-quality container offices perfect for small offices, accommodation, and temporary structures. Flexible rental terms available."
        fallbackCanonical="https://www.samanportable.com/container-rent-services/20x8-container-office-rental"
        keywords="portable cabin rental, container office rental, office space rental, temporary office"
        author="Saman Portable Office Solutions"
        publisher="Saman Portable Office Solutions"
      />
      <div className="min-h-screen bg-background">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                20x8 Container Office Rental
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Compact 160 sq ft container offices perfect for small offices, accommodation, 
                and commercial spaces. Available for flexible rental periods across Bangalore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-8 py-4 text-lg">
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
                    Perfect for Small-Scale Operations
                  </h2>
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 15, 2025
                  </p>
                  <p className="text-muted-foreground text-lg mb-6">
                    Our 20x8 container offices provide the ideal solution for small-scale operations. 
                    With 160 square feet of usable area, these container offices are perfect for 
                    temporary offices, accommodation, retail spaces, and commercial applications.
                  </p>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#0A3D2A] flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8">
                  <div className="aspect-video bg-white rounded-xl shadow-lg overflow-hidden">
                    <Image 
                      src="/container-office-by-saman (1).jpg" 
                      alt="20×8 Container Office"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Technical Specifications
                </h2>
                <p className="text-muted-foreground text-lg">
                  Detailed specifications of our 20x8 container office rental units
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {specifications.map((spec, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-semibold text-foreground mb-2">{spec.label}</h3>
                    <p className="text-[#0A3D2A] font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Terms */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Rental Terms
                </h2>
                <p className="text-muted-foreground text-lg">
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
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ideal Applications
                </h2>
                <p className="text-muted-foreground text-lg">
                  Versatile solutions for various business needs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Small Offices", description: "Perfect for startups, consultants, or small teams" },
                  { title: "Accommodation", description: "Comfortable living quarters for workers or temporary residents" },
                  { title: "Retail Spaces", description: "Pop-up shops, kiosks, or temporary retail locations" },
                  { title: "Medical Facilities", description: "Temporary clinics, testing centers, or medical offices" },
                  { title: "Educational Centers", description: "Training rooms, classrooms, or study spaces" },
                  { title: "Commercial Use", description: "Any temporary commercial space requirement" }
                ].map((app, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-semibold text-foreground mb-3">{app.title}</h3>
                    <p className="text-muted-foreground text-sm">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Process */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Simple Rental Process
                </h2>
                <p className="text-muted-foreground text-lg">
                  Get your container office delivered in just a few simple steps
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Contact Us", description: "Get in touch for a free quote and consultation" },
                  { step: "2", title: "Site Survey", description: "Our team visits your location for assessment" },
                  { step: "3", title: "Installation", description: "Professional setup and installation at your site" },
                  { step: "4", title: "Ready to Use", description: "Your container office is ready for immediate use" }
                ].map((process, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-[#0A3D2A] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{process.step}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{process.title}</h3>
                    <p className="text-muted-foreground text-sm">{process.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-[#0A3D2A] text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Rent Your 20x8 Container Office?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get in touch with us today for a free consultation and quote. 
                Our team is ready to help you find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-8 py-4 text-lg">
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

export default ContainerOffice20x8Rental;





