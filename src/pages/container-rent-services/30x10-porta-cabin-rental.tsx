import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Phone, Mail, Clock, Package, Shield, ShieldCheck, Truck, Wrench, Zap, Thermometer, Move, Leaf, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

const PortaCabin30x10Rental = () => {
  const features = [
    "Spacious 300 sq ft interior space",
    "High-quality steel construction",
    "Insulated walls and roof",
    "Multiple windows for natural light",
    "Electrical fittings and lighting",
    "Ventilation system",
    "Fire-resistant materials",
    "Easy assembly and disassembly"
  ];

  const specifications = [
    { label: "Dimensions", value: "30' x 10' x 10'" },
    { label: "Floor Area", value: "300 sq ft" },
    { label: "Wall Height", value: "8' (internal)" },
    { label: "Material", value: "Galvanized Steel" },
    { label: "Insulation", value: "Glass wool or Rockwool" },
    { label: "Windows", value: "2-3 units" },
    { label: "Doors", value: "1 main entrance" },
    { label: "Minimum Rental", value: "6 months" }
  ];

  const rentalTerms = [
    { title: 'Flexible Rental Duration', description: 'Short-term is 6 months minimum and long-term is one year or more.' },
    { title: 'Security Deposits', description: '1.5 lakh within Bangalore and 2 lakhs outside Bangalore.' },
    { title: 'No Rent Deduction', description: 'No rent deduction from the deposit.' },
    { title: 'Delivery and Setup', description: 'Transportation co sides, loading and unloading are born by client.' },
    { title: 'Deposit Refund', description: 'Deposit would be 100% refunded one material reach safely to factory. If any damage, we will deduct from deposit after mutual understanding.' }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="30×10 Porta Cabin Rental Bangalore & Delhi NCR | SAMAN Portable"
        fallbackDescription="Rent a 300 sq ft 30×10 porta cabin in Bangalore with 24-48 hr setup, BIS compliance, HVAC options & 24×7 support. Flexible daily, weekly & monthly rates."
        fallbackCanonical="https://www.samanportable.com/container-rent-services/30x10-porta-cabin-rental"
        keywords="30x10 porta cabin rental, 300 sq ft office cabin, portable cabin rental Bangalore, site office rental, security cabin rental"
        author="Saman Portable Office Solutions"
        publisher="Saman Portable Office Solutions"
      />
      <div className="min-h-screen bg-background">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                30x10 Porta Cabin Rental
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Spacious 300 sq ft portable cabins perfect for temporary offices, accommodation,
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Perfect for Medium-Scale Operations
                  </h2>
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 21, 2026
                  </p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our 30×10 ft porta cabins deliver the ideal balance of space and portability, offering 300 sq ft of well-appointed workspace for temporary offices, site accommodations, retail kiosks, and commercial applications. Constructed on a robust steel frame with corrosion-resistant coating, these units meet BIS IS-3840 fire safety standards and include insulated walls and roof panels to ensure year-round comfort.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      "Spacious 300 sq ft interior with configurable partitions",
                      "Premium steel construction with weatherproof finish",
                      "Insulated panels for thermal efficiency and noise reduction",
                      "Multiple windows for abundant natural light and ventilation",
                      "Pre-installed electrical fittings: outlets, LED lights, and switches",
                      "Integrated ventilation system with optional HVAC upgrade",
                      "Fire-resistant materials and secure locking mechanisms",
                      "Swift assembly/disassembly in 4–6 hours without heavy equipment"
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
                      src="/30x10-portable-office-cabin-rental.png"
                      alt="30x10 Portable Office Cabin - Spacious 300 sq ft Rental Unit"
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
                  Premium 30×10 Porta Cabin Rental for Project Offices & Site Use
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our 30×10 ft porta cabin delivers the ideal balance of space and portability, offering 300 sq ft of versatile workspace for project offices, site accommodations, retail kiosks, and commercial applications.
                </p>
              </div>

              {/* Detailed Text Content */}
              <div className="prose prose-lg max-w-none text-slate-700 mb-20">
                <p>
                  Engineered on a high-strength steel frame with corrosion-resistant coating, it meets BIS IS-3840 fire safety standards and provides exceptional durability against Bangalore’s varied weather conditions.
                </p>
                <p>
                  The open-plan interior can be configured with modular partitions, furniture clusters, or consultation stations to suit engineering teams, security control rooms, or temporary classrooms. Reinforced windows flood the space with natural light, reducing reliance on artificial lighting during daytime operations. Standard features include pre-installed electrical wiring, energy-efficient LED lighting, and a built-in ventilation system. For year-round comfort, upgrade to a complete HVAC package and enhanced insulation.
                </p>
              </div>

              {/* Rapid Deployment & Versatility Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <div className="bg-[#0A3D2A] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Rapid Deployment</h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Designed for swift on-site assembly, our certified technicians complete setup and leveling in just <span className="text-white font-bold">4–6 hours</span> without cranes or heavy machinery.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Disassemble & Redeploy Anytime
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-green-400" /> Maximize Site Utilization
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 relative shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                    <Wrench className="w-7 h-7 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Guarantee</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Every rental includes weekly preventive maintenance and a <span className="text-gray-900 font-bold">2–4 hour emergency support guarantee</span>, ensuring uninterrupted productivity.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Uninterrupted productivity
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> For event planners & field ops
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buying Option Callout */}
              <div className="bg-gradient-to-r from-gray-900 to-[#0A3D2A] rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden mb-20">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Looking to Buy Instead of Rent?</h3>
                  <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                    For clients ready to purchase their own custom porta cabin, explore our premium range of porta cabins for sale — available in multiple sizes and configurations.
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
                  Detailed specifications of our 30x10 porta cabin rental units
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
                  FAQs – 30×10 Porta Cabin Rental
                </h2>
                <p className="text-xl text-muted-foreground">
                  Common questions about our 300 sq ft cabin rentals.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { q: "1. What is the monthly rental cost for a 30×10 porta cabin?", a: "Rental rates range from ₹25,000 to ₹35,000 per month, depending on optional upgrades (HVAC, partitions) and delivery location within Bangalore’s service zones." },
                  { q: "2. Can I customize the floor plan inside the 300 sq ft cabin?", a: "Yes. Select from modular partition walls, built-in storage units, and varied furniture layouts to create private offices, meeting areas, or open workstations." },
                  { q: "3. How quickly can the cabin be installed and ready for use?", a: "Our certified technicians complete site installation and leveling in just 4–6 hours, minimizing project downtime." },
                  { q: "4. Are electrical and lighting fixtures included in the rental?", a: "Yes. Each unit comes pre-wired with multiple power outlets, LED fixtures, and switches. HVAC system upgrades are available on request." },
                  { q: "5. What preventive maintenance services are included?", a: "Weekly inspections cover structural, electrical, and ventilation system checks. Repairs or adjustments are performed at no extra charge." },
                  { q: "6. Can I extend or shorten the rental duration?", a: "Flexible rental terms allow contract modifications with 30 days’ notice. Daily and weekly rentals are also available for short-term needs." },
                  { q: "7. Is delivery available to remote or industrial sites?", a: "Absolutely. We serve all major zones around Bangalore—Whitefield, Electronic City, Peenya, Bommasandra—with 24–48 hour delivery windows." },
                  { q: "8. How is disassembly and relocation handled?", a: "When you’re ready to move, our team dismantles and transports the cabin to your new site within 24 hours, ensuring seamless project transitions." },
                  { q: "9. Are security features included?", a: "Standard units feature reinforced doors, lockable windows, and optional CCTV mounts. Alarm systems and access control upgrades can be integrated." },
                  { q: "10. Where can I purchase a new 30×10 porta cabin instead of renting?", a: "Visit our purchase catalog for custom builds, pricing details, and delivery options at samanportable.com/product/porta-cabins." }
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
                Ready to Rent Your 30×10 Porta Cabin?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Contact us now for a free site evaluation, personalized consultation, and an instant rental quote. Our specialists will guide you through selecting the perfect 300 sq ft porta cabin.
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

export default PortaCabin30x10Rental;





