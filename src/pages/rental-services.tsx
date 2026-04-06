import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { ArrowRight, Building2, Container, Package, Clock, MapPin, Phone, Mail, CheckCircle, Zap, MessageSquare, Globe, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';
import { pageSEO, siteConfig } from '@/config/seo';

const RentalServicesPage = () => {
  interface RentalService {
    id: number;
    title: string;
    description: string;
    features: string[];
    link: string;
    idealFor: string;
    capacity: string;
  }

  const rentalServices: RentalService[] = [
    {
      id: 1,
      title: '40×10 Porta Cabin Rental - Executive Office Suite',
      description: '₹35,000-45,000/month | 400 sq ft spacious workspace. Perfect for large construction site offices, temporary corporate headquarters, or multi-team accommodation. This flagship unit features partition-ready interiors, executive-grade furnishing options, and dual-entry accessibility. Popular with IT companies in Whitefield and major construction projects requiring professional site management offices.',
      features: ['400 sq ft spacious workspace', 'Climate control ready', 'Executive furniture options', 'Partition-ready interiors'],
      link: '/container-rent-services/40x10-porta-cabin-rental',
      idealFor: 'Site supervisors, project managers, corporate meetings',
      capacity: '8-10 people'
    },
    {
      id: 2,
      title: '30×10 Porta Cabin Rental - Project Office Standard',
      description: '₹25,000-35,000/month | 300 sq ft professional workspace. The most requested size for medium-scale construction projects and temporary business operations. Features professional-grade interiors with customizable layouts, perfect for on-site engineering teams or temporary classrooms. BIS-certified construction ensures weather resistance across Bangalore\'s climate variations.',
      features: ['300 sq ft professional workspace', 'Weather-resistant BIS certified', 'Customizable layouts', 'Utility-ready'],
      link: '/container-rent-services/30x10-porta-cabin-rental',
      idealFor: 'Engineering teams, temporary classrooms, site meetings',
      capacity: '6-8 people'
    },
    {
      id: 3,
      title: '20×10 Porta Cabin Rental - Compact Office Solution',
      description: '₹18,000-25,000/month | 200 sq ft efficient workspace. Best-seller for small construction sites and startup office expansions. This compact unit maximizes space efficiency while delivering professional workspace standards. Ideal for security offices, small retail operations, or individual consultant offices. Quick positioning on tight job sites with minimal site preparation required.',
      features: ['200 sq ft efficient workspace', 'Minimal site prep required', 'Quick positioning', 'Cost-efficient'],
      link: '/container-rent-services/20x10-porta-cabin-rental',
      idealFor: 'Security stations, small offices, retail spaces',
      capacity: '4-5 people'
    },
    {
      id: 4,
      title: '10×10 Porta Cabin Rental - Individual Office Pod',
      description: '₹12,000-18,000/month | 100 sq ft personal workspace. Ultra-portable individual office solution perfect for site supervisors, security personnel, or remote consultants. Despite its compact size, includes essential office amenities with optional climate control. Lightweight design allows positioning in challenging locations with crane-free installation.',
      features: ['100 sq ft personal workspace', 'Crane-free installation', 'Lightweight design', 'Budget-friendly'],
      link: '/container-rent-services/10x10-porta-cabin-rental',
      idealFor: 'Individual offices, security stations, supervisor cabins',
      capacity: '1-2 people'
    },
    {
      id: 5,
      title: '40×8 Container Office Rental - Premium Commercial Space',
      description: '₹32,000-42,000/month | 320 sq ft modern office. Steel-constructed container office delivering corporate-grade workspace with superior durability. Multi-unit combination ready for complex office layouts. Features modern amenities including advanced insulation, professional lighting, and HVAC-ready infrastructure. Popular with IT service companies and large construction firms.',
      features: ['320 sq ft modern office', 'Steel construction durability', 'HVAC-ready infrastructure', 'Multi-unit combination ready'],
      link: '/container-rent-services/40x8-container-office-rental',
      idealFor: 'Corporate offices, multi-team operations, long-term projects',
      capacity: '6-8 people'
    },
    {
      id: 6,
      title: '30×8 Container Office Rental - Flexible Workspace',
      description: '₹22,000-32,000/month | 240 sq ft adaptable office. Medium-capacity container office with flexible interior configurations. Repositionable design allows relocation as project phases evolve. High-quality construction withstands harsh site conditions while maintaining professional workspace standards. Includes workstation layouts and meeting room configurations.',
      features: ['240 sq ft adaptable office', 'Repositionable design', 'Configurable interiors', 'High-quality construction'],
      link: '/container-rent-services/30x8-container-office-rental',
      idealFor: 'Evolving projects, medium teams, adaptable workspace',
      capacity: '4-6 people'
    },
    {
      id: 7,
      title: '20×8 Container Office Rental - Team Workspace',
      description: '₹16,000-22,000/month | 160 sq ft efficient office. Optimized for small teams and remote work sites requiring professional workspace standards. Maximum space utilization with efficient design layouts. Quick setup capability makes it ideal for short-term projects and rapid deployment scenarios. Includes options for specialized outfitting.',
      features: ['160 sq ft efficient office', 'Maximum space utilization', 'Rapid deployment', 'Specialized outfitting options'],
      link: '/container-rent-services/20x8-container-office-rental',
      idealFor: 'Small teams, remote sites, short-term projects',
      capacity: '3-4 people'
    },
    {
      id: 8,
      title: '10×8 Container Office Rental - Consultant\'s Choice',
      description: '₹10,000-16,000/month | 80 sq ft professional pod. Individual consultant\'s premium workspace with secure, professional environment. Compact footprint fits constrained construction sites while delivering full office functionality. Cost-effective solution for independent professionals requiring secure, weatherproof workspace with low maintenance requirements.',
      features: ['80 sq ft professional pod', 'Secure environment', 'Compact footprint', 'Low maintenance'],
      link: '/container-rent-services/10x8-container-office-rental',
      idealFor: 'Independent consultants, secure workspace, budget projects',
      capacity: '1-2 people'
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Fast Installation & Quick Setup',
      description: 'Our prefabricated cabins and container offices are manufactured offsite and delivered ready to use. You can have your workspace up and running within 24–48 hours, which is much faster than traditional construction. This rapid deployment is ideal for job sites, events, or temporary facilities where time is critical.'
    },
    {
      icon: <Package className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Flexible Rental Terms',
      description: 'We offer shortterm and longterm rental agreements to fit your project timeline. Renting gives you the freedom to pay only for the space you require, without getting locked into costly, multiyear leases. When your needs change, you can easily scale up by adding more units or scale down by returning unused cabins.'
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Quality & Safety Assured',
      description: 'Every rental unit is built from durable materials designed to withstand various weather conditions. Porta cabins provide a stable and secure workspace thanks to robust construction and premium materials. Shipping containers can last for more than 12 years and require minimal maintenance, ensuring a safe environment for your team.'
    },
    {
      icon: <Container className="w-8 h-8 text-[#0A3D2A]" />,
      title: 'Maintenance & Support Included',
      description: 'We handle regular upkeep and provide support throughout your rental period, so you can focus on your project. Container offices are inherently lowmaintenance, and our team performs routine checks to ensure everything stays in top condition.'
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.rental.title}
        fallbackDescription={pageSEO.rental.description}
        fallbackCanonical={pageSEO.rental.canonical}
        keywords={pageSEO.rental.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-16 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Professional Rental Services for Portable Cabins and Container Offices
              </h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
                Looking for a flexible space solution without a longterm commitment? Saman Portable Office Solutions offers portable cabin rental, porta cabin rental and container office rental services designed for businesses in Bangalore and beyond. Renting means you only pay for the space you need, when you need it, which is much more affordable than signing a conventional office lease. We supply modern, prefab structures that are quick to install, easy to relocate and fully equipped for comfortable work or accommodation.
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
                  We provide portable cabin rental and container office rental solutions that are reliable, flexible, and costeffective. Our goal is to deliver highquality prefabricated structures with outstanding service, making it easy for you to get the space you need — right when you need it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                    <div className="w-14 h-14 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0A3D2A] transition-colors duration-300">
                      {React.cloneElement(benefit.icon as React.ReactElement, {
                        className: "w-7 h-7 text-[#0A3D2A] group-hover:text-white transition-colors duration-300"
                      })}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-[#0A3D2A] transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
                  <strong>Last updated:</strong> January 21, 2026
                </p>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choose from our comprehensive range of 8 rental solutions designed to meet your specific requirements. Each service is available in multiple sizes and configurations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rentalServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors leading-tight min-h-[3.5rem]">
                        {service.title}
                      </h3>

                      <div className="text-sm text-gray-600 mb-6 flex-grow">
                        <p className="font-medium text-[#0A3D2A] mb-2 text-base border-b border-gray-100 pb-2">
                          {service.description.split('|')[0]} | <span className="text-gray-500 font-normal">{service.description.split('|')[1]?.split('.')[0]}</span>
                        </p>
                        <p className="line-clamp-4 leading-relaxed">
                          {service.description.split('.').slice(1).join('.').trim()}
                        </p>
                      </div>

                      <div className="space-y-4 mb-6 pt-4 border-t border-gray-50 bg-gray-50/50 -mx-6 px-6 py-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Highights:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {service.features.slice(1, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#0A3D2A] mt-1">•</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                            <p className="font-medium text-gray-900">{service.capacity}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Setup Time</p>
                            <p className="font-medium text-gray-900">24-48 Hours</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                        <Link href={service.link} className="w-full">
                          <Button className="w-full bg-[#0A3D2A] hover:bg-[#145C41] text-white group-hover:scale-[1.02] transition-transform">
                            View Details <ArrowRight className="w-4 h-4 ml-2" />
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
                  Our Streamlined Rental Process
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  From inquiry to installation in as little as 4 hours, experience Bangalore’s most reliable and transparent porta cabin and container office rental service. Our 4-step digital rental process ensures zero delays, complete visibility, and a workspace that’s ready when you need it.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Step 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Instant Quote & Expert Consultation</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3" /> Call: +91 88616 22859 <span className="mx-1">|</span> <Clock className="w-3 h-3" /> Quote in 2 mins
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">How It Works</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Instant availability check from our 50+ unit fleet</li>
                        <li>• Customized cabin recommendations for your site needs</li>
                        <li>• Transparent pricing — no hidden charges</li>
                        <li>• Same-day site visit scheduling for complex projects</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">What You Receive</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Written quote within 30 minutes via email or WhatsApp</li>
                        <li>• Multiple cabin size options with full specifications</li>
                        <li>• Flexible rental terms — daily, weekly, or monthly</li>
                        <li>• Professional advice on layout and placement</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-[#0A3D2A] font-medium text-sm">
                    <Clock className="w-4 h-4 mr-2" /> Timeline: Immediate response, quote in 30 minutes
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Free Site Evaluation & Assessment</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3" /> On-site technical visit within 4 hours
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Our Experts Ensure:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Ground and access route inspection for placement</li>
                        <li>• Power, water, and drainage connection check</li>
                        <li>• Site compliance and safety verification</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Technical Assessment Includes</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Load-bearing and leveling checks</li>
                        <li>• Layout recommendation for workflow efficiency</li>
                        <li>• Setup method planning (ground or crane)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-[#0A3D2A] font-medium text-sm">
                    <Clock className="w-4 h-4 mr-2" /> Timeline: 4–24 hours depending on location
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Digital Agreement & Fast Installation</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <FileText className="w-3 h-3" /> Paperless onboarding + same-day delivery
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Simple Digital Process</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Sign agreement via mobile or email</li>
                        <li>• Multiple payment options — UPI, bank transfer, or corporate</li>
                        <li>• Insurance and compliance handled automatically</li>
                        <li>• 2-hour delivery window scheduling</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Professional Setup</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Certified team handles full installation</li>
                        <li>• Electrical, furniture, and AC ready</li>
                        <li>• Quality inspection before handover</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-[#0A3D2A] font-medium text-sm">
                    <Clock className="w-4 h-4 mr-2" /> Timeline: Delivery to setup within 24–48 hours
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Continuous Support & Maintenance</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Wrench className="w-3 h-3" /> 24×7 technical and operational support
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">What’s Included</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Weekly maintenance checks with inspection reports</li>
                        <li>• Emergency service in 2–4 hours across Bangalore</li>
                        <li>• Preventive maintenance to avoid downtime</li>
                        <li>• Free upgrades during long-term rentals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Additional Services</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Cleaning and sanitation</li>
                        <li>• Utility bill tracking and energy optimization</li>
                        <li>• Relocation and extension support</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-[#0A3D2A] font-medium text-sm">
                    <Clock className="w-4 h-4 mr-2" /> Timeline: Ongoing support with guaranteed response
                  </div>
                </div>
              </div>

              {/* Why process stands out */}
              <div className="bg-[#0A3D2A] rounded-2xl p-8 md:p-12 text-white mb-16">
                <h3 className="text-2xl font-bold mb-8 text-center">Why Our Process Stands Out</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    "Fastest Setup: Workspace ready in 24–48 hours",
                    "No Hidden Costs: Written quotes for every project",
                    "Certified Installation: BIS-trained technicians",
                    "Round-the-Clock Support: 2–4 hour response time",
                    "Flexible Plans: Modify, extend, or relocate anytime",
                    "Fully Digital: Quick, paperless, and eco-friendly process"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-white/90">{feature.split(':')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to get started */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Urgent Requirement</h4>
                  <p className="text-sm text-gray-600 mb-3">(Same Day)</p>
                  <a href="tel:+918861622859" className="text-red-700 font-bold hover:underline">+91 88616 22859</a>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Detailed Quotes</h4>
                  <p className="text-sm text-gray-600 mb-3">Via Email</p>
                  <a href="mailto:sales@samanportable.com" className="text-blue-700 font-bold hover:underline">sales@samanportable.com</a>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Quick Queries</h4>
                  <p className="text-sm text-gray-600 mb-3">WhatsApp</p>
                  <a href="https://wa.me/918861622859" className="text-green-700 font-bold hover:underline">+91 88616 22859</a>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Book Online</h4>
                  <p className="text-sm text-gray-600 mb-3">Instant Quotes</p>
                  <Link href="/" className="text-purple-700 font-bold hover:underline">Visit Website</Link>
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
                  We provide porta cabin and container office rental services across Bangalore and Delhi NCR, ensuring fast delivery, professional installation, and 24×7 dedicated support for every site location.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bangalore City */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:border-[#0A3D2A] transition-colors group">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center text-xl">🏢</div>
                    <h3 className="text-xl font-bold text-gray-900">Bangalore City</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Comprehensive coverage of Bangalore city across all major business, residential, and commercial zones. Our quick delivery and setup services make it easier for corporates, contractors, and event organizers.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Service Areas</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Central Business District</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> IT Corridors</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Industrial Clusters</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Mixed-Use Zones</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#0A3D2A] mb-2 text-sm">Key Highlights</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Fast delivery within 24 hours</li>
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> On-site maintenance support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Greater Bangalore */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:border-[#0A3D2A] transition-colors group">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center text-xl">🌇</div>
                    <h3 className="text-xl font-bold text-gray-900">Greater Bangalore</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Extended service to Bangalore’s satellite towns and technology hubs, providing portable cabins and container offices for IT campuses and infrastructure projects.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Service Areas</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Whitefield</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Electronic City</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Sarjapur Road</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Outer Ring Road</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#0A3D2A] mb-2 text-sm">Key Highlights</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Pre-fabricated site offices</li>
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Monthly maintenance included</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Industrial Areas */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:border-[#0A3D2A] transition-colors group">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center text-xl">🏗️</div>
                    <h3 className="text-xl font-bold text-gray-900">Industrial Areas</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Specialized services for industrial, warehouse, and large-scale construction sites across Bangalore’s key production and logistics hubs.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Service Areas</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Peenya Industrial Area</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Bommasandra</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Doddaballapur</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Nelamangala</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#0A3D2A] mb-2 text-sm">Key Highlights</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Heavy-duty container offices</li>
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> BIS standards compliant</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Delhi NCR - NEW */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:border-[#0A3D2A] transition-colors group">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center text-xl">🏙️</div>
                    <h3 className="text-xl font-bold text-gray-900">Delhi NCR</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Now serving Delhi NCR with premium porta cabin rentals and container office rentals, designed for corporate expansions and infrastructure projects.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Service Areas</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Delhi & Noida</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Gurugram</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Ghaziabad</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#0A3D2A] rounded-full"></div> Faridabad</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-[#0A3D2A] mb-2 text-sm">Key Highlights</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Rapid 24–48 hour deployment</li>
                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#0A3D2A] mt-0.5 shrink-0" /> Local compliance ready</li>
                      </ul>
                    </div>
                  </div>
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

export default RentalServicesPage;

