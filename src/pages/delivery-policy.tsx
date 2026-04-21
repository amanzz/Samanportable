import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';
import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeliveryPolicy = () => {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.deliveryPolicy.title}
        fallbackDescription={pageSEO.deliveryPolicy.description}
        fallbackCanonical={pageSEO.deliveryPolicy.canonical}
        keywords={pageSEO.deliveryPolicy.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      {/* remove duplicate Head tags if any; keep content intact */}
      {/* Head tags handled by UnifiedSEO; removed duplicate Head block */}
      
      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-12 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Delivery Policy
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Fast, reliable delivery of portable office solutions across Bangalore and surrounding areas.
              </p>
            </div>
          </section>

          {/* Content Section */}
          <section className="section-padding">
            <div className="max-w-4xl mx-auto container-padding">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/">
                  <Button variant="outline" size="sm" className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-[#0A3D2A]/30 hover:bg-[#0A3D2A]/10 text-slate-700 hover:text-[#0A3D2A] transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                  </Button>
                </Link>
              </div>

              {/* Delivery Policy Content */}
              <div className="max-w-none">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-[#0A3D2A] mb-6">Delivery Policy</h2>
                  
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 15, 2025
                  </p>
                  
                  <p className="text-slate-700 mb-6">
                    At Saman Portable Office Solutions, we understand that timely delivery is crucial for your business operations. Our comprehensive delivery policy ensures that your portable office solutions reach you safely and on schedule.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Coverage Areas</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Primary Coverage</h4>
                          <p className="text-slate-700 text-sm">Bangalore City and surrounding areas within 50km radius</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Extended Coverage</h4>
                          <p className="text-slate-700 text-sm">Greater Bangalore, Whitefield, Electronic City, and nearby industrial areas</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Timeline</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Standard Delivery</h4>
                          <p className="text-slate-700 text-sm">3-5 business days from order confirmation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Express Delivery</h4>
                          <p className="text-slate-700 text-sm">1-2 business days (additional charges apply)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Process</h3>
                  
                  <div className="space-y-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Order Confirmation</h4>
                        <p className="text-slate-700 text-sm">Once your order is confirmed, our team will contact you within 24 hours to schedule delivery.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Site Assessment</h4>
                        <p className="text-slate-700 text-sm">Our delivery team will assess your site to ensure proper access and placement requirements.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Delivery & Installation</h4>
                        <p className="text-slate-700 text-sm">Professional delivery and basic installation at your specified location.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Quality Check</h4>
                        <p className="text-slate-700 text-sm">Final inspection to ensure everything meets our quality standards.</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Requirements</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-green-800 mb-3">Important Information</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-2 text-sm">
                      <li>Clear access to the delivery location (minimum 3 meters width)</li>
                      <li>Level ground surface for proper placement</li>
                      <li>Someone must be present at the delivery location</li>
                      <li>All necessary permits and permissions must be obtained</li>
                      <li>Payment must be completed before delivery</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Charges</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-800">Free Delivery</h4>
                        <p className="text-slate-700 text-sm">Within 25km of Bangalore city center</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Additional Charges</h4>
                        <p className="text-slate-700 text-sm">₹2,000 - ₹5,000 for areas beyond 25km</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Special Delivery Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="w-6 h-6 text-[#0A3D2A]" />
                        <h4 className="font-semibold text-slate-800">Express Delivery</h4>
                      </div>
                      <p className="text-slate-700 text-sm">Priority delivery within 24-48 hours for urgent requirements.</p>
                      <p className="text-[#0A3D2A] font-semibold text-sm mt-2">Additional ₹3,000</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-6 h-6 text-[#0A3D2A]" />
                        <h4 className="font-semibold text-slate-800">Weekend Delivery</h4>
                      </div>
                      <p className="text-slate-700 text-sm">Delivery on weekends and holidays for your convenience.</p>
                      <p className="text-[#0A3D2A] font-semibold text-sm mt-2">Additional ₹1,500</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Tracking</h3>
                  <p className="text-slate-700 mb-4">
                    We provide real-time delivery tracking through:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>SMS updates at key delivery milestones</li>
                    <li>WhatsApp notifications with delivery status</li>
                    <li>Phone call from our delivery team 1 hour before arrival</li>
                    <li>Online tracking portal (coming soon)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Delays</h3>
                  <p className="text-slate-700 mb-4">
                    While we strive for on-time delivery, certain circumstances may cause delays:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Adverse weather conditions</li>
                    <li>Traffic congestion or road closures</li>
                    <li>Site access issues</li>
                    <li>Unforeseen technical difficulties</li>
                  </ul>
                  <p className="text-slate-700 mb-6">
                    In case of delays, we will immediately notify you and provide an updated delivery timeline.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Post-Delivery Support</h3>
                  <p className="text-slate-700 mb-4">
                    After delivery, our support team will:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Ensure proper setup and functionality</li>
                    <li>Provide basic usage instructions</li>
                    <li>Address any immediate concerns</li>
                    <li>Schedule follow-up maintenance if required</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Contact Information</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <p className="text-slate-700 mb-4">
                      For delivery-related inquiries or to schedule delivery:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Delivery Hotline:</strong> +91 88616 22859
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Customer Service:</strong> +91 88616 22859
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Email:</strong> sales@samanportable.com
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Need Immediate Assistance?</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      For urgent delivery requirements or special arrangements, please contact our delivery team directly.
                    </p>
                    <Button className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90">
                      Contact Delivery Team
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default DeliveryPolicy;

