import React from 'react';

import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, Shield, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundAndReturnPolicyPage() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.refundPolicy.title}
        fallbackDescription={pageSEO.refundPolicy.description}
        fallbackCanonical={pageSEO.refundPolicy.canonical}
        keywords={pageSEO.refundPolicy.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      {/* removed any extra Head tags; keep the policy content intact */}
      {/* Head tags handled by UnifiedSEO; removed duplicate Head block */}

      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-12 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Refund and Return Policy
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Customer satisfaction is our priority. Learn about our return and refund policies.
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

              {/* Refund and Return Policy Content */}
              <div className="max-w-none">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-[#0A3D2A] mb-6">Refund and Return Policy</h2>

                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> June 7, 2026
                  </p>

                  <p className="text-slate-700 mb-6">
                    At SAMAN POS India Private Limited, we manufacture and supply portable cabins, porta cabins, container offices, portable toilets, labour colonies, prefab buildings, and related prefabricated structures. This policy explains our return, exchange, and refund rules for products purchased from SAMAN Portable.
                  </p>

                  {/* Quick summary box for clear Merchant Center review */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">Return &amp; Refund Summary</h3>
                        <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                          <li>Returns accepted for both defective and non-defective products.</li>
                          <li>Product condition accepted: new only.</li>
                          <li>Standard return window: 7 days from delivery or installation.</li>
                          <li>Returns are by mail/transport; return shipping is the customer&rsquo;s responsibility.</li>
                          <li>No standard restocking fee.</li>
                          <li>Approved refunds processed within 7 days of inspection.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Returns Accepted</h3>
                  <p className="text-slate-700 mb-4">
                    We accept returns for both defective and non-defective standard products, subject to the conditions below.
                  </p>
                  <p className="text-slate-700 mb-4">
                    Standard products may be returned within 7 days from the date of delivery or installation. The product must be new, unused, undamaged, not modified, and in the same condition as delivered.
                  </p>
                  <p className="text-slate-700 mb-6">
                    Custom-made, site-specific, installed, used, modified, or specially fabricated products are not eligible for normal non-defective returns. However, they may be reviewed for return, repair, replacement, or correction if the product is defective, damaged on arrival, wrongly delivered, or does not match approved specifications.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Custom Product Return Request Window</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Standard Products</h4>
                          <p className="text-slate-700 text-sm">7 days from delivery or installation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Custom / Site-Specific Products</h4>
                          <p className="text-slate-700 text-sm">3 days from delivery or installation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-6">
                    For custom-made or site-specific products, any return, repair, replacement, or correction request must be raised within 3 days from the date of delivery or installation. Approval will depend on inspection and the nature of the issue.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Eligible Return Reasons</h3>
                  <p className="text-slate-700 mb-4">
                    A return request may be accepted when:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>The product is defective.</li>
                    <li>The product arrives damaged.</li>
                    <li>The wrong product is delivered.</li>
                    <li>The product does not match approved specifications.</li>
                    <li>A standard, non-defective product is returned within 7 days in new and unused condition.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Return Method</h3>
                  <p className="text-slate-700 mb-6">
                    All approved returns must be initiated by contacting SAMAN customer support first. Products must be returned by mail, transport, or the return method confirmed by SAMAN POS India Private Limited. Customers must not send any product back without written return authorization.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Return Shipping and Transport Cost</h3>
                  <p className="text-slate-700 mb-4">
                    Return shipping, transport, loading, unloading, crane, toll, RTO, dismantling, packing, and related return logistics costs are the customer&rsquo;s responsibility unless SAMAN POS India Private Limited confirms otherwise in writing.
                  </p>
                  <p className="text-slate-700 mb-4">
                    For approved defective, damaged, wrong-product, or specification-mismatch cases, SAMAN may support or arrange return logistics within Bangalore and Delhi NCR service areas only. These service areas include Bangalore, Noida, Greater Noida, Delhi, Gurugram, Faridabad, and Ghaziabad.
                  </p>
                  <p className="text-slate-700 mb-6">
                    For all other India locations, return logistics costs are the customer&rsquo;s responsibility unless SAMAN confirms a different arrangement in writing.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Restocking Fee</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">No Standard Restocking Fee</h4>
                        <p className="text-blue-700 text-sm">
                          SAMAN does not charge a standard restocking fee for approved returns. However, deductions may apply if the returned product has missing accessories, damage, modification, use marks, site damage, or missing documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Refund Processing Time</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Processing Time</h4>
                          <p className="text-slate-700 text-sm">Within 7 days after the returned product is received, inspected, and approved</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800">Bank / Gateway Time</h4>
                          <p className="text-slate-700 text-sm">Bank, payment gateway, or account processing may take additional time depending on the payment method</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-6">
                    Approved refunds will be processed within 7 days after the returned product is received, inspected, and approved by SAMAN POS India Private Limited. Bank, payment gateway, or account processing timelines may take additional time depending on the payment method.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Refund Method</h3>
                  <p className="text-slate-700 mb-6">
                    Refunds will be issued through the original payment method wherever possible. If the original payment method is not available, SAMAN may process the refund by bank transfer after verification.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Exchanges</h3>
                  <p className="text-slate-700 mb-6">
                    We accept exchanges where practical and approved by SAMAN POS India Private Limited. Exchange requests may apply to size changes, configuration changes, colour/finish changes, product correction, or replacement of defective products. Any difference in product price, transport cost, loading/unloading, crane charges, or site-related charges must be paid by the customer before dispatch.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Non-Returnable Cases</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-red-800 mb-3">Returns may be rejected in the following cases</h4>
                    <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                      <li>Return request raised after the allowed return window.</li>
                      <li>Product used, installed, modified, damaged, or altered after delivery.</li>
                      <li>Custom-made or site-specific product returned for normal non-defective reasons.</li>
                      <li>Product returned without written authorization.</li>
                      <li>Product missing accessories, documents, fittings, or approved components.</li>
                      <li>Damage caused by improper handling, site conditions, unauthorized repair, misuse, or natural events.</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Warranty Information</h3>
                  <p className="text-slate-700 mb-6">
                    SAMAN warranty coverage includes 5 years on the structural frame and base, 1&ndash;2 years on finishing depending on product specification, and 20&ndash;25 years engineered service life under proper use and maintenance. The 20&ndash;25 years engineered service life is not a warranty period.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Contact for Returns and Refunds</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <p className="text-slate-700 mb-4">
                      For returns, refunds, exchanges, or warranty claims, contact <strong>SAMAN POS India Private Limited</strong>:
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

                  <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                    <p className="text-slate-600 text-sm text-center">
                      <strong>Note:</strong> This policy is subject to change without notice. Please check our website for the most current version.
                    </p>
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

// Removed duplicate default export
// default export already declared above as RefundAndReturnPolicyPage
