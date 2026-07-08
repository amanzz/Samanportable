import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin, Phone, Mail } from 'lucide-react';
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
        structuredData={[
          generateWebPageSchema({
            url: 'https://www.samanportable.com/delivery-policy',
            name: pageSEO.deliveryPolicy.title,
            description: pageSEO.deliveryPolicy.description,
          }),
          generateBreadcrumbSchema([
            { name: 'Home', url: 'https://www.samanportable.com/' },
            { name: 'Delivery Policy', url: 'https://www.samanportable.com/delivery-policy' },
          ]),
        ]}
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
                Pan-India delivery of portable cabins and prefab structures, with transport cost confirmed by quotation.
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
                    <strong>Last updated:</strong> June 7, 2026
                  </p>

                  <p className="text-slate-700 mb-6">
                    SAMAN POS India Private Limited supplies portable cabins, porta cabins, container offices, portable toilets, labour colonies, prefab buildings, and related prefabricated structures across India. Because these products are large, heavy, and often project-specific, final delivery and transport charges are confirmed through quotation.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Coverage</h3>
                  <p className="text-slate-700 mb-4">
                    SAMAN delivers across India subject to transport availability, route permission, vehicle access, site readiness, and product size. Our main service areas are:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Bangalore</h4>
                          <p className="text-slate-700 text-sm">Bangalore and nearby Karnataka project locations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Delhi NCR</h4>
                          <p className="text-slate-700 text-sm">Delhi NCR, including Noida, Greater Noida, Delhi, Gurugram, Faridabad, and Ghaziabad</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Rest of India</h4>
                          <p className="text-slate-700 text-sm">Other India locations served through quotation-based transport</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Merchant Center Default Shipping Charge</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Truck className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Default Flat Shipping Charge: &#8377;3,000</h4>
                        <p className="text-blue-700 text-sm">
                          For Google Merchant Center, a default flat shipping charge of &#8377;3,000 is shown as a minimum/default shipping value. This is not a final all-India transport quote.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-4">
                    Final shipping, transport, loading, unloading, crane, toll, RTO, route permission, and site-handling charges may vary based on:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Delivery location</li>
                    <li>Product size and weight</li>
                    <li>Vehicle type</li>
                    <li>Route distance</li>
                    <li>Site access</li>
                    <li>Loading and unloading requirement</li>
                    <li>Crane or hydra requirement</li>
                    <li>Local permissions, tolls, RTO, and route restrictions</li>
                  </ul>
                  <p className="text-slate-700 mb-6">
                    The final delivery cost will be confirmed in the quotation before order confirmation.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Free Delivery Clarification</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <p className="text-amber-800 text-sm font-semibold mb-2">
                      SAMAN does not provide free delivery all over India.
                    </p>
                    <p className="text-amber-700 text-sm mb-2">
                      Local delivery support may be available only in selected Bangalore and Delhi NCR service areas, depending on order value, product type, vehicle access, and written quotation terms.
                    </p>
                    <p className="text-amber-700 text-sm">
                      The service areas include Bangalore, Noida, Greater Noida, Delhi, Gurugram, Faridabad, and Ghaziabad. Any free or included delivery must be clearly mentioned in the written quotation. If it is not mentioned in the quotation, delivery and transport charges are extra.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Timeline</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-800">Standard / Default Estimate</h4>
                        <p className="text-slate-700 text-sm">3&ndash;5 business days, as shown in Google Merchant Center</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-4">
                    The Merchant Center delivery timeline is shown as 3&ndash;5 business days as a standard/default delivery estimate. Actual delivery timelines depend on:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Product availability</li>
                    <li>Customization requirement</li>
                    <li>Production schedule</li>
                    <li>Payment confirmation</li>
                    <li>Site readiness</li>
                    <li>Transport availability</li>
                    <li>Distance from the nearest SAMAN factory or dispatch point</li>
                  </ul>
                  <p className="text-slate-700 mb-6">
                    For standard available products, dispatch may be planned faster. For custom-made products, production and delivery timelines will be mentioned in the quotation.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Process</h3>
                  <div className="space-y-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Order Confirmation</h4>
                        <p className="text-slate-700 text-sm">After quotation approval and payment confirmation, SAMAN confirms the product, size, specification, delivery address, and site contact.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Site Access Check</h4>
                        <p className="text-slate-700 text-sm">The customer must confirm road width, entry gate size, unloading area, ground level, crane/hydra need, and permissions before dispatch.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Dispatch Planning</h4>
                        <p className="text-slate-700 text-sm">SAMAN arranges or coordinates the suitable vehicle based on product size, route, and delivery location.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Delivery and Placement</h4>
                        <p className="text-slate-700 text-sm">The product is delivered to the approved site location. Placement, unloading, crane, or installation support is provided only as per quotation terms.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Final Check</h4>
                        <p className="text-slate-700 text-sm">The customer or site representative should inspect the product during delivery and report any visible transit damage immediately.</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Requirements</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-green-800 mb-3">The customer must ensure</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-2 text-sm">
                      <li>Clear vehicle access to the site</li>
                      <li>Required permissions from owner, society, authority, contractor, or project manager</li>
                      <li>Suitable unloading space</li>
                      <li>Level and ready foundation or placement area</li>
                      <li>Availability of crane/hydra if required</li>
                      <li>Site representative available during delivery</li>
                      <li>Payment completed as per quotation terms</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Delivery Delays</h3>
                  <p className="text-slate-700 mb-6">
                    Delivery may be delayed due to weather, traffic, route restrictions, RTO checks, local permissions, vehicle issues, site access problems, crane delay, payment delay, or changes in product specification. SAMAN will update the customer if any delay affects the agreed schedule.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Contact for Delivery Support</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <p className="text-slate-700 mb-4">
                      For delivery-related inquiries, contact <strong>SAMAN POS India Private Limited</strong>:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Email:</strong> sales@samanportable.com
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Bangalore / South India:</strong> Call +91 80886 85440 &middot; WhatsApp +91 88616 22859
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Delhi NCR / North India:</strong> Call +91 87960 39938 &middot; WhatsApp +91 97089 89937
                        </span>
                      </div>
                    </div>
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
