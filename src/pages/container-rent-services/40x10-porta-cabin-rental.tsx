import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield, ShieldCheck, Truck, Wrench, Zap, Thermometer, Move, Leaf, Settings } from 'lucide-react';
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
    { label: 'Minimum Rental', value: '6 months' }
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
      <UnifiedSEO
        fallbackTitle="Premium 40×10 Porta Cabin for Rent in Bangalore & Delhi NCR"
        fallbackDescription="Rent quality-tested 40×10 porta cabins with quick 4–6 hr setup, insulated interiors & 24×7 support across Bangalore and Delhi NCR."
        fallbackCanonical="https://www.samanportable.com/container-rent-services/40x10-porta-cabin-rental"
        keywords="40x10 porta cabin rental, large porta cabin rental, spacious portable cabin, temporary office rental, construction site cabin"
        author="SAMAN POS India Private Limited"
        publisher="SAMAN POS India Private Limited"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Product\", \"@id\": \"https://www.samanportable.com/container-rent-services/40x10-porta-cabin-rental#product\", \"name\": \"40x10 Porta Cabin Rental\", \"description\": \"400 sq ft porta cabin for rent in Bangalore and Delhi NCR. PUF-insulated, pre-wired, ISO-certified. Ideal for 8-10 person site offices and temporary accommodation.\", \"image\": [\"https://www.samanportable.com/40x10-executive-porta-cabin-office.png\"], \"category\": \"Porta Cabin Rental\", \"brand\": {\"@id\": \"https://www.samanportable.com/#organization\"}, \"additionalProperty\": [{\"@type\": \"PropertyValue\", \"name\": \"Structural warranty\", \"value\": \"5 years\"}, {\"@type\": \"PropertyValue\", \"name\": \"Standard warranty (fittings)\", \"value\": \"1 year, extendable to 2 years on request\"}], \"offers\": {\"@type\": \"Offer\", \"businessFunction\": \"http://purl.org/goodrelations/v1#LeaseOut\", \"priceCurrency\": \"INR\", \"availability\": \"https://schema.org/InStock\", \"seller\": {\"@id\": \"https://www.samanportable.com/#organization\"}, \"eligibleDuration\": {\"@type\": \"QuantitativeValue\", \"minValue\": 6, \"unitCode\": \"MON\"}, \"priceSpecification\": {\"@type\": \"UnitPriceSpecification\", \"minPrice\": \"35000\", \"maxPrice\": \"45000\", \"priceCurrency\": \"INR\", \"unitCode\": \"MON\"}}}" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.samanportable.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Rental Services",
                "item": "https://www.samanportable.com/rental-services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "40x10 Porta Cabin Rental",
                "item": "https://www.samanportable.com/container-rent-services/40x10-porta-cabin-rental"
              }
            ]
          }) }}
        />
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

          {/* Product Overview & Detailed Content */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Premium 40×10 Porta Cabin
                  </h2>
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 21, 2026
                  </p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our 40×10 ft porta cabins are designed for maximum comfort, durability, and function — ideal for 8–10-person site offices, executive cabins, or temporary accommodation units. Built with high-strength steel frames, PUF-insulated panels, and pre-wired electrical systems, these units provide a ready-to-use workspace within hours.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      'Spacious 400 sq ft interior with flexible partitions',
                      'Durable, corrosion-resistant construction',
                      'Insulated walls and roof for thermal efficiency',
                      'Pre-wired LED lighting, outlets, and switches',
                      'Ventilation system with optional HVAC',
                      'Secure doors and grilled windows',
                      'Rapid setup in 4–6 hours, easy relocation',
                      'Custom interior fit-outs for office or staff use'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <QuoteFormTrigger size="lg" className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 px-8 py-4 text-lg">
                      Request Quote
                    </QuoteFormTrigger>
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                      Download Brochure
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-2xl p-8 sticky top-24">
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden mb-6 relative">
                    <Image
                      src="/40x10-executive-porta-cabin-office.png"
                      alt="40x10 Executive Site Office Cabin - Large 400 sq ft Container Office"
                      fill
                      className="object-cover"
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

              {/* Enhanced Detailed Content with Premium Design */}
              <section className="section-padding bg-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 -left-24 w-64 h-64 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto container-padding relative z-10">
                  <div className="max-w-3xl mx-auto mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      Prefabricated Workspace Solutions for the Modern Site
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Designed for site offices, project teams, and corporate events, this 400 sq ft portable cabin ensures comfort, fast setup, and energy efficiency. Manufactured using quality-tested steel and industry-standard processes with flexible rental options.
                    </p>
                  </div>

                  {/* Premium Feature Grid - Why Choose */}
                  <div className="mb-20">
                    <div className="text-center mb-10">
                      <span className="bg-[#0A3D2A]/10 text-[#0A3D2A] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">Premium Features</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">Why Choose Our 40×10 Cabin?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { icon: ShieldCheck, title: "Built to Last", desc: "Corrosion-proof steel chassis ensures durability even under heavy site conditions." },
                        { icon: Thermometer, title: "Climate Control", desc: "PUF insulation and weather-sealed doors maintain year-round indoor comfort." },
                        { icon: Move, title: "Flexible Design", desc: "Modular layout supports expansion, relocation, or refurbishment as needs change." },
                        { icon: Leaf, title: "Eco-Friendly", desc: "Reusable, low-emission materials align with sustainable building practices." }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-50 hover:bg-white rounded-2xl p-6 transition-all duration-300 border border-slate-100 hover:border-[#0A3D2A]/20 hover:shadow-xl group">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <item.icon className="w-6 h-6 text-[#0A3D2A]" />
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deployment & Maintenance Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <div className="bg-[#0A3D2A] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                          <Truck className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Deployment Excellence</h3>
                        <p className="text-white/80 mb-6 leading-relaxed">
                          Installation is handled by our certified technicians, completing site assembly in <span className="text-white font-bold">just 4–6 hours</span> through ground placement (no crane needed).
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-sm font-medium">
                            <CheckCircle className="w-5 h-5 text-green-400" /> Transportation Included
                          </li>
                          <li className="flex items-center gap-3 text-sm font-medium">
                            <CheckCircle className="w-5 h-5 text-green-400" /> Certified Installers
                          </li>
                          <li className="flex items-center gap-3 text-sm font-medium">
                            <CheckCircle className="w-5 h-5 text-green-400" /> No Crane Required
                          </li>
                        </ul>
                      </div>
                      {/* Decorative Circle */}
                      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full"></div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 relative shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                        <Wrench className="w-7 h-7 text-green-700" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Guarantee</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Zero downtime is our promise. A dedicated account manager provides rapid technical support within <span className="text-gray-900 font-bold">2–4 hours</span>.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Weekly maintenance checks
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Inspection reports provided
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Free upgrades for long-term rentals
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Key Advantages List */}
                  <div className="mb-20">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">
                      <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Advantages</h3>
                          <p className="text-gray-600 mb-6">
                            Renting offers immediate access to a fully equipped workspace without the cost or delay of permanent construction.
                          </p>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ideal For Industries</p>
                            <p className="text-sm font-medium text-gray-800">
                              Construction, Infrastructure, Real Estate, IT Parks, Manufacturing, Defense, Education
                            </p>
                          </div>
                        </div>

                        <div className="md:w-2/3">
                          <h4 className="text-lg font-bold text-[#0A3D2A] mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5" /> Included Services
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              "Delivery & installation within 24 hours",
                              "Weekly maintenance & cleaning support",
                              "24×7 helpline for technical issues",
                              "Optional furniture & HVAC systems",
                              "Electrical safety certification",
                              "Free relocation support (conditions apply)"
                            ].map((service, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buying Option Callout */}
                  <div className="bg-gradient-to-r from-gray-900 to-[#0A3D2A] rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">Looking to Buy Instead of Rent?</h3>
                      <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                        If you’re planning a long-term setup or wish to own your cabin outright, explore our range of porta cabins for sale — fully customizable and built for permanence.
                      </p>
                      <Link href="/contact">
                        <Button className="bg-white text-[#0A3D2A] hover:bg-gray-100 border-none font-bold px-8 py-6 text-lg rounded-xl transition-all hover:scale-105 shadow-lg">
                          Explore Purchase Options
                        </Button>
                      </Link>
                    </div>
                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  </div>
                </div>
              </section>
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

          {/* FAQ Section */}
          <section className="section-padding bg-white">
            <div className="max-w-4xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Frequently Asked Questions (FAQs)
                </h2>
                <p className="text-xl text-muted-foreground">
                  Everything you need to know about renting a 40×10 porta cabin.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { q: "1. How much does it cost to rent a 40×10 porta cabin?", a: "Rental rates range from ₹35,000 to ₹45,000 per month, depending on customization, duration, and delivery location. Short-term daily and weekly plans are available upon request." },
                  { q: "2. What is the minimum rental period?", a: "Our standard minimum rental period is 6 months, with options for quarterly and annual contracts." },
                  { q: "3. Can I customize the interior layout?", a: "Yes — choose from partition walls, furniture sets, lighting styles, and storage solutions to create your ideal workspace." },
                  { q: "4. How long does installation and removal take?", a: "Our team completes installation and dismantling within 4–6 hours using ground placement methods that avoid crane costs." },
                  { q: "5. Do you offer daily, weekly, and monthly rental plans?", a: "Absolutely. Flexible plans are available to fit your project schedule and budget." },
                  { q: "6. Are your porta cabins fire-safe and durable?", a: "Yes. All units are manufactured using quality-tested steel and industry-standard processes, with fire safety and seismic Zone III compliance measures built in." },
                  { q: "7. What locations do you serve?", a: "We serve Bangalore City, Greater Bangalore, Industrial Areas (Peenya, Bommasandra, Doddaballapur, Nelamangala), and Delhi NCR (New Delhi, Noida, Gurugram, Ghaziabad)." },
                  { q: "8. Is maintenance included in the rental cost?", a: "Yes. Weekly preventive maintenance and 24×7 emergency response (within 2–4 hours) are included at no additional charge." },
                  { q: "9. Can porta cabins be relocated mid-rental?", a: "Yes, relocation is part of our service. We can move your cabin anywhere within our coverage zones in less than 24 hours." },
                  { q: "10. Do you offer HVAC and electrical installations?", a: "Every cabin is pre-wired for power and lighting, and we offer optional HVAC installation handled by licensed technicians." }
                ].map((faq, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
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
                  onClick={() => window.location.href = 'tel:+918861622859'}
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

