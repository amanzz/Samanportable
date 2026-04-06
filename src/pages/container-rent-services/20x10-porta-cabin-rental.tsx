import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield, ShieldCheck, Truck, Wrench, Zap, Thermometer, Move, Leaf, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const PortaCabin20x10Rental = () => {
  const features = [
    "Compact 200 sq ft interior space",
    "High-quality steel construction",
    "Insulated walls and roof",
    "Multiple windows for natural light",
    "Electrical fittings and lighting",
    "Ventilation system",
    "Fire-resistant materials",
    "Easy assembly and disassembly"
  ];

  const specifications = [
    { label: "Dimensions", value: "20' x 10' x 10'" },
    { label: "Floor Area", value: "200 sq ft" },
    { label: "Wall Height", value: "8' (internal)" },
    { label: "Material", value: "Galvanized Steel" },
    { label: "Insulation", value: "Glass wool or Rockwool" },
    { label: "Windows", value: "2 units" },
    { label: "Doors", value: "1 main entrance" },
    { label: "Minimum Rental", value: "6 months" }
  ];

  const rentalTerms = [
    { title: 'Flexible Rental Duration', description: 'Short-term is 6 months minimum and long-term is one year or more.' },
    { title: 'Security Deposits', description: '1 lakhs within Bangalore and 1.5 lakhs outside Bangalore.' },
    { title: 'No Rent Deduction', description: 'No rent deduction from the deposit.' },
    { title: 'Delivery and Setup', description: 'Transportation co sides, loading and unloading are born by client.' },
    { title: 'Deposit Refund', description: 'Deposit would be 100% refunded one material reach safely to factory. If any damage, we will deduct from deposit after mutual understanding.' }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="20×10 Porta Cabin Rental Bangalore & Delhi NCR | Quick Setup"
        fallbackDescription="Rent a 20×10 portable cabin in Bangalore or Delhi NCR—200 sq ft workspace, 24–48 hr delivery, BIS-compliant, flexible terms, and 24×7 support. Book now."
        fallbackCanonical="https://www.samanportable.com/container-rent-services/20x10-porta-cabin-rental"
        keywords="20x10 porta cabin rental, 200 sq ft office cabin, small portable office, portable cabin Bangalore, site office rental"
        author="Saman Portable Office Solutions"
        publisher="Saman Portable Office Solutions"
      />
      <div className="min-h-screen bg-background">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                20x10 Porta Cabin Rental
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Compact 200 sq ft portable cabins perfect for small offices, accommodation,
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
                  onClick={() => window.location.href = 'tel:+918861622859'}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Perfect 20×10 Porta Cabin Rental for Compact Workspaces
                  </h2>
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 21, 2026
                  </p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our 20×10 ft porta cabins deliver 200 sq ft of highly efficient workspace, perfectly sized for small offices, security stations, retail kiosks, and field labs. Built on a durable steel frame with anti-corrosion coating and BIS-compliant fire-resistant panels, these cabins ensure safety and longevity in Bangalore’s varied climate.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      "Compact 200 sq ft interior for optimal space utilization",
                      "Heavy-duty steel construction with weatherproof finish",
                      "Fully insulated walls and roof for thermal comfort and sound dampening",
                      "Multiple reinforced windows maximizing natural light and cross-ventilation",
                      "Pre-installed electrical wiring, energy-efficient LED fixtures, and switches",
                      "Integrated ventilation system; HVAC upgrade available",
                      "Secure locking doors and optional alarm/CCTV mounts",
                      "Quick assembly/disassembly in 4–6 hours without crane assistance"
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
                      src="/20x10-site-office-cabin-bangalore.png"
                      alt="20x10 Porta Cabin Site Office - 200 sq ft Modular Office Rental"
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
            </div>
          </section>

          {/* Premium Detailed Content */}
          <section className="section-padding bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 -left-24 w-64 h-64 bg-[#0A3D2A]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto container-padding relative z-10">
              <div className="max-w-3xl mx-auto mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Discover the Ultimate 20×10 Porta Cabin Solution
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Unlock agile workspace flexibility with our 20×10 ft porta cabin—engineered for peak performance in compact spaces. Whether you need a secure site office, a retail kiosk, or a field lab, this 200 sq ft unit empowers small-scale operations.
                </p>
              </div>

              {/* Detailed Text Content */}
              <div className="prose prose-lg max-w-none text-slate-700 mb-20">
                <p>
                  Designed on a heavy-duty steel frame with corrosion-resistant coatings, each cabin meets BIS fire safety and seismic compliance standards. Insulated walls and roofs maintain optimal temperatures, while reinforced windows maximize natural light and airflow, reducing energy costs. Pre-installed wiring and LED fixtures streamline setup, and optional HVAC packages deliver year-round comfort for teams working in Bangalore’s fluctuating climate.
                </p>
              </div>

              {/* Rapid Deployment & Cost-Effective Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <div className="bg-[#0A3D2A] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Rapid Deployment for Agile Operations</h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Experience industry-leading setup times—our certified technicians assemble and level each unit in just <span className="text-white font-bold">4–6 hours</span> without cranes.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Ground Placement (No Crane)
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Ideal for Pop-up Retailers
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 relative shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-7 h-7 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Cost-Effective, Low-Maintenance</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    With a lean price point and transparent rental terms, this cabin delivers exceptional ROI. All materials are reusable and eco-friendly.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Weekly preventive maintenance included
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 2-4 hour emergency support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buying Option Callout */}
              <div className="bg-gradient-to-r from-gray-900 to-[#0A3D2A] rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden mb-20">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Equip Your Team with a Professional Workspace</h3>
                  <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                    Enjoy flexible 6-month minimum rentals or purchase outright through our custom build program.
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

          {/* Specifications (Kept but styled) */}
          <section className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Technical Specifications
                </h2>
                <p className="text-muted-foreground text-lg">
                  Detailed specifications of our 20x10 porta cabin rental units
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {specifications.map((spec, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-foreground mb-2">{spec.label}</h3>
                    <p className="text-[#0A3D2A] font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="section-padding bg-white">
            <div className="max-w-4xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  FAQs – 20×10 Porta Cabin Rental
                </h2>
                <p className="text-xl text-muted-foreground">
                  Common questions about our 200 sq ft cabin rentals.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { q: "1. What is the monthly rental rate for a 20×10 porta cabin?", a: "Rental rates start at ₹18,000 per month, varying slightly based on location, duration, and optional upgrades like HVAC or partitions." },
                  { q: "2. Can the 200 sq ft cabin be fitted with office furniture?", a: "Yes. Choose from modular desks, storage cabinets, and seating options to create a fully equipped workspace tailored to your needs." },
                  { q: "3. How fast can the cabin be assembled on-site?", a: "Our certified team completes installation and leveling in 4–6 hours using ground placement—no crane required—ensuring minimal project disruption." },
                  { q: "4. Are electrical outlets and lighting included?", a: "Each unit comes pre-wired with multiple power outlets and energy-efficient LED fixtures. You can add additional wiring or specialty lighting upon request." },
                  { q: "5. Do you offer climate control for this cabin size?", a: "Standard ventilation is included; upgrade to a split AC or central HVAC system for reliable temperature control year-round." },
                  { q: "6. How often is maintenance performed during the rental?", a: "We conduct weekly preventive maintenance covering structural, electrical, and ventilation inspections at no extra cost." },
                  { q: "7. Can I rent the 20×10 cabin for less than six months?", a: "The minimum standard term is six months, but shorter weekly or monthly rentals may be arranged based on availability and project requirements." },
                  { q: "8. Is delivery available to industrial and remote areas?", a: "Yes. We serve all major industrial zones and remote sites across Bangalore and Greater Bangalore with 24–48 hour delivery windows." },
                  { q: "9. What security features are standard on the cabin?", a: "Standard units include lockable steel doors, reinforced window grills, and optional CCTV/alarm system integrations for enhanced safety." },
                  { q: "10. Can the cabin be relocated mid-rental?", a: "Absolutely. We offer relocation services at any point in your rental term, with the cabin moved and reinstalled at your new site within 24 hours." }
                ].map((faq, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-[#0A3D2A] text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Book Your 20×10 Portable Workspace – Bangalore & Delhi NCR
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Secure a 200 sq ft modular cabin for site offices, security posts, or retail — available across Bangalore and Delhi NCR. Enjoy 24–48 hr delivery, BIS-certified quality, and 24×7 expert support from SAMAN Portable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-10">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> What to expect</h4>
                  <p className="text-sm text-white/80">Comprehensive project review, transparent pricing, and custom layout options</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Key benefits</h4>
                  <p className="text-sm text-white/80">Rapid installation, energy-efficient LED lighting, optional HVAC upgrades, and 24×7 emergency support</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-400" /> Service coverage</h4>
                  <p className="text-sm text-white/80">Bangalore City, Whitefield, Electronic City, Peenya, Bommasandra, and Greater Bangalore</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger variant="white" size="lg" className="px-8 py-4 text-lg">
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

export default PortaCabin20x10Rental;






