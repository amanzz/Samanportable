import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield, Building2, ListChecks, UserCheck, HardHat, Truck, Zap, Move, Settings, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const ContainerOffice40x8Rental = () => {
  const features = [
    "Spacious 320 sq ft interior layout",
    "High-quality container-grade steel construction",
    "Insulated walls and roof for heat and noise control",
    "Multiple windows for natural daylight and airflow",
    "Pre-installed electrical fittings and lighting",
    "Efficient ventilation system",
    "Fire-resistant materials for safety",
    "Easy assembly and dismantling, ideal for relocation"
  ];

  const specifications = [
    { label: "Dimensions", value: "40' x 8' x 8.5'" },
    { label: "Floor Area", value: "320 sq ft" },
    { label: "Wall Height", value: "7.5' (internal)" },
    { label: "Material", value: "Galvanized Steel" },
    { label: "Insulation", value: "50mm Glass wool" },
    { label: "Windows", value: "3-4 units" },
    { label: "Doors", value: "1 main entrance" },
    { label: "Weight", value: "Approx. 3 tons" }
  ];

  const rentalTerms = [
    {
      title: 'Rental Period & Flexibility',
      description: 'Minimum 6 months commitment. Long-term rentals (12 months+) available for infrastructure and industrial projects.'
    },
    {
      title: 'Security Deposit Policy',
      description: 'Refundable deposit: ₹2,00,000 (Bangalore) / ₹2,50,000 (Outside). Safeguards structure during specific usage.'
    },
    {
      title: 'Clear Rent Separation',
      description: 'Security deposit is strictly independent of monthly rent. No adjustments made, ensuring transparent accounting.'
    },
    {
      title: 'Transportation & Handling',
      description: 'Costs based on distance/access. Loading/unloading is client responsibility. We provide coordination guidance.'
    },
    {
      title: 'Deposit Return Process',
      description: '100% refund eligible upon safe return and inspection. Deductions only for agreed damages after mutual confirmation.'
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="40×8 Container Office on Rent in Bangalore | Flexible Rental"
        fallbackDescription="Rent a 40×8 container office in Bangalore for large projects, offices, or commercial use. Spacious 320 sq ft unit with clear terms and fast setup."
        fallbackCanonical="https://www.samanportable.com/container-rent-services/40x8-container-office-rental"
        keywords="40x8 container office rental, large site office rental, 320 sq ft office container, portable office Bangalore, construction site office"
        author="SAMAN POS India Private Limited"
        publisher="SAMAN POS India Private Limited"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Product\", \"@id\": \"https://www.samanportable.com/container-rent-services/40x8-container-office-rental#product\", \"name\": \"40x8 Container Office Rental\", \"description\": \"320 sq ft container office for rent in Bangalore and Delhi NCR. Galvanized steel, insulated, HVAC-ready. Built for large project offices and corporate site teams.\", \"image\": [\"https://www.samanportable.com/40x8-container-office-rental-bangalore.png\"], \"category\": \"Container Office Rental\", \"brand\": {\"@id\": \"https://www.samanportable.com/#organization\"}, \"additionalProperty\": [{\"@type\": \"PropertyValue\", \"name\": \"Structural warranty\", \"value\": \"5 years\"}, {\"@type\": \"PropertyValue\", \"name\": \"Standard warranty (fittings)\", \"value\": \"1 year, extendable to 2 years on request\"}], \"offers\": {\"@type\": \"Offer\", \"businessFunction\": \"http://purl.org/goodrelations/v1#LeaseOut\", \"priceCurrency\": \"INR\", \"availability\": \"https://schema.org/InStock\", \"seller\": {\"@id\": \"https://www.samanportable.com/#organization\"}, \"eligibleDuration\": {\"@type\": \"QuantitativeValue\", \"minValue\": 6, \"unitCode\": \"MON\"}, \"priceSpecification\": {\"@type\": \"UnitPriceSpecification\", \"minPrice\": \"32000\", \"maxPrice\": \"42000\", \"priceCurrency\": \"INR\", \"unitCode\": \"MON\"}}}" }}
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
                "name": "40x8 Container Office Rental",
                "item": "https://www.samanportable.com/container-rent-services/40x8-container-office-rental"
              }
            ]
          }) }}
        />
      </Head>
      <div className="min-h-screen bg-background">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A] text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                40×8 Container Office on Rent in Bangalore
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
                Need a large, ready-to-use container office for your project or business? Our 40×8 container office cabins (320 sq ft) offer a spacious, professional workspace ideal for site offices, corporate project teams, and commercial operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  Get a Free Rental Quote
                </QuoteFormTrigger>
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="px-8 py-4 text-lg bg-transparent border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => window.location.href = 'tel:+918861622859'}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for Immediate Support
                </Button>
              </div>
            </div>
          </section>

          {/* Back Navigation */}
          <section className="py-6 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto container-padding">
              <Link href="/rental-services">
                <Button variant="ghost" size="sm" className="group flex items-center gap-2 text-slate-600 hover:text-[#0A3D2A] transition-colors">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Rental Services</span>
                </Button>
              </Link>
            </div>
          </section>

          {/* Product Overview */}
          <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Perfect for Large-Scale Operations
                    </h2>
                    <p className="text-sm text-[#0A3D2A] font-semibold bg-green-50 inline-block px-3 py-1 rounded-full mb-6">
                      Last updated: January 21, 2026
                    </p>
                    <div className="prose prose-lg text-slate-600">
                      <p className="leading-relaxed">
                        Our 40×8 container office rentals are purpose-built for projects and businesses that require more space, better functionality, and a professional working environment. With 320 sq ft of well-planned usable area, these container offices comfortably support team operations, meetings, storage, and daily workflows without congestion.
                      </p>
                      <p className="leading-relaxed mt-4">
                        Unlike small temporary cabins, a 40×8 container office offers the flexibility to create a true office-like setup at your site. It is widely used for infrastructure projects, construction headquarters, industrial facilities, temporary corporate offices, retail setups, and staff accommodation, where durability and space efficiency are critical.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#0A3D2A]" /> Key Features
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative lg:sticky lg:top-24">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="aspect-[4/3] relative bg-slate-100">
                      <Image
                        src="/40x8-container-office-rental-bangalore.png"
                        alt="40x8 Container Office Conversion - 320 sq ft Industrial Workflow Space"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <span className="text-slate-500">Availability</span>
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> In Stock
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700">
                          <Clock className="w-5 h-5 text-[#0A3D2A]" />
                          <span>Setup Time: <strong>24-48 Hours</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                          <Package className="w-5 h-5 text-[#0A3D2A]" />
                          <span>Min. Rental: <strong>6 Months</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                          <MapPin className="w-5 h-5 text-[#0A3D2A]" />
                          <span>Delivery: <strong>Bangalore & NCR</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Detailed Content (Discovery Section) */}
          <section className="section-padding bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 -left-24 w-64 h-64 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto container-padding relative z-10">
              <div className="max-w-3xl mx-auto mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Engineered for Enterprise-Grade Projects
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Engineered with a strong steel structure and proper insulation, the cabin performs reliably across changing weather conditions while maintaining interior comfort. Ready electrical fittings, ventilation, and natural light ensure a productive workspace from day one.
                </p>
              </div>

              {/* Why Choose Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {[
                  { icon: Building2, title: "320 Sq Ft Space", desc: "Ample room for teams, meetings, and storage without congestion." },
                  { icon: Shield, title: "Steel Build", desc: "High-quality container-grade steel for exceptional durability and security." },
                  { icon: Zap, title: "Ready-to-Use", desc: "Pre-installed electricals and lighting for immediate operations." },
                  { icon: Move, title: "Scalable", desc: "Scale operations quickly without permanent construction investments." }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-[#0A3D2A]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Rapid Deployment & Maintenance Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <div className="bg-[#0A3D2A] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Fast Deployment</h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Designed for comfort, durability, and fast deployment, these container offices are available on flexible rental terms with quick delivery across Bangalore.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Suitable for short & long term
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Professional working environment
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 relative shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                    <Settings className="w-7 h-7 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Setup</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    A 40×8 container office offers the flexibility to create a true office-like setup at your site, widely used for headquarters and industrial facilities.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> For infrastructure projects
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> For corporate offices
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buying Option Callout */}
              <div className="bg-gradient-to-r from-gray-900 to-[#0A3D2A] rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden mb-8">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Looking to Buy Instead?</h3>
                  <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                    We also offer custom-manufactured 40x8 container offices for sale. Perfect for permanent installations or long-term asset acquisition.
                  </p>
                  <Link href="/contact">
                    <Button className="bg-white text-[#0A3D2A] hover:bg-gray-100 border-none font-bold px-8 py-6 text-lg rounded-xl transition-all hover:scale-105 shadow-lg">
                      Explore Purchase Options
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Technical Specifications
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Engineered for durability and performance in large-scale operations
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {specifications.map((spec, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                    <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">{spec.label}</p>
                    <p className="text-lg font-bold text-[#0A3D2A]">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Terms */}
          <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Rental Terms & Conditions
                  </h2>
                  <p className="text-slate-600 text-lg max-w-2xl">
                    Tailored for EPC contractors, infrastructure developers, and corporate teams requiring clarity.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-lg text-sm font-semibold">
                    <Shield className="w-4 h-4" /> 100% Refundable Deposit Policy
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rentalTerms.map((term, index) => (
                  <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all border border-slate-100 relative group">
                    <div className="w-12 h-12 bg-[#0A3D2A]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0A3D2A] transition-colors">
                      <ListChecks className="w-6 h-6 text-[#0A3D2A] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0A3D2A] transition-colors">
                      {term.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                ))}
                {/* Why Clients Prefer Card */}
                <div className="bg-[#0A3D2A] rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <UserCheck className="w-6 h-6" /> Designed for Enterprise
                  </h3>
                  <ul className="space-y-4">
                    {['No hidden clauses', 'Full accountability', 'Long-term reliability', 'Ideal for corporate teams'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Applications Section */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ideal Applications for 40×8 Container Offices</h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Designed for versatility and scale where space, mobility, and speed of deployment are critical.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Large Project Offices", desc: "Full-scale site headquarters for construction and infrastructure zones. Accommodates teams and meetings." },
                  { title: "Workforce Accommodation", desc: "Adapted for temporary staff accommodation or supervision rooms for long-duration projects." },
                  { title: "Retail & Commercial", desc: "Secure, weather-resistant structures for temporary showrooms and pop-up retail outlets." },
                  { title: "Medical Facilities", desc: "Controlled environments for clinics and testing centers with proper ventilation." },
                  { title: "Training Centers", desc: "Classrooms and skill-development centers in remote locations." },
                  { title: "Industrial Use", desc: "Administrative blocks, control rooms, and operations centers." }
                ].map((app, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{app.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{app.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0A3D2A]/5 rounded-2xl p-8 border border-[#0A3D2A]/10 text-center">
                <h3 className="text-xl font-bold text-[#0A3D2A] mb-2">Why 40×8 Fits Diverse Applications</h3>
                <p className="text-slate-700">The larger footprint, structural strength, and ready-to-use design make this a preferred choice for organizations seeking professional-grade temporary infrastructure.</p>
              </div>
            </div>
          </section>

          {/* Rental Process */}
          <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Streamlined Container Office Rental Process
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Predictable, professional, and disruption-free workflow for large projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

                {[
                  { step: '01', title: 'Discussion & Quote', desc: 'Share details. We provide a clear, itemized quote with defined terms.', outcome: 'Cost clarity.' },
                  { step: '02', title: 'Site Feasibility', desc: 'We assess access, crane feasibility, and ground level for smooth delivery.', outcome: 'Zero logistical issues.' },
                  { step: '03', title: 'Scheduled Delivery', desc: 'Transport and placement coordinated to ensure safe positioning.', outcome: 'Time-bound execution.' },
                  { step: '04', title: 'Handover', desc: 'Ready-to-use condition for immediate office operations.', outcome: 'Uninterrupted workflows.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white border-4 border-slate-50 text-[#0A3D2A] font-bold text-2xl rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm relative z-10 group-hover:border-[#0A3D2A] transition-colors">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.desc}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Outcome: {item.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Why Our Process Stands Out */}
              <div className="bg-slate-50 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Built for Projects Where Time and Clarity Matter</h3>
                <p className="text-slate-600 mb-8">Supports EPC contractors, developers, and industrial operators who need speed and structure.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Clear Accountability', 'Minimizes Site Disruption', 'Trusted by Infrastructure', 'Long-Duration Rentals'].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-full font-medium text-sm shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-[#0A3D2A] text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Plan Your 40×8 Container Office Rental with Confidence
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Designed for serious operations, these units support day-to-day work, meetings, and on-site management. Get the right balance of space, durability, and speed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16 text-left">
                {[
                  { icon: Clock, text: "Faster Setup" },
                  { icon: ListChecks, text: "Clear Rental Structure" },
                  { icon: HardHat, text: "Proven Solution" },
                  { icon: Move, text: "Scalable Use" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <item.icon className="w-8 h-8 text-green-400" />
                    <span className="font-bold text-lg">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-10 py-5 text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Request a Detailed Rental Quote
                </QuoteFormTrigger>
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="px-10 py-5 text-xl border-2 hover:bg-white hover:text-[#0A3D2A]"
                  onClick={() => window.location.href = 'tel:+918861622859'}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Speak to a Container Office Expert
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

export default ContainerOffice40x8Rental;





