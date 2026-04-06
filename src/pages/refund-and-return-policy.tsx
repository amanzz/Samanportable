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
                    <strong>Last updated:</strong> January 15, 2025
                  </p>
                  
                  <p className="text-slate-700 mb-6">
                    At Saman Portable Office Solutions, we stand behind the quality of our products and services. This policy outlines the terms and conditions for returns, refunds, and exchanges of our portable office solutions.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">Quality Guarantee</h3>
                        <p className="text-green-700 text-sm">
                          We offer a comprehensive warranty on all our products and guarantee customer satisfaction. If you&apos;re not completely satisfied with your purchase, we&apos;re here to help.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Return Policy</h3>
                  
                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Eligibility for Returns</h4>
                  <p className="text-slate-700 mb-4">
                    Products may be returned under the following conditions:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Product arrives damaged or defective</li>
                    <li>Product does not match the description or specifications</li>
                    <li>Wrong product was delivered</li>
                    <li>Product has manufacturing defects</li>
                    <li>Return request is made within the specified time frame</li>
                  </ul>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Return Timeframe</h4>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-slate-800">Standard Products</h5>
                          <p className="text-slate-700 text-sm">7 days from delivery date</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-slate-800">Custom Products</h5>
                          <p className="text-slate-700 text-sm">3 days from delivery date</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Return Process</h4>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h5 className="font-semibold text-slate-800">Contact Customer Service</h5>
                        <p className="text-slate-700 text-sm">Call or email us within the return timeframe to initiate the return process.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h5 className="font-semibold text-slate-800">Return Authorization</h5>
                        <p className="text-slate-700 text-sm">We will provide you with a Return Authorization Number (RAN) and return instructions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h5 className="font-semibold text-slate-800">Product Return</h5>
                        <p className="text-slate-700 text-sm">Pack the product securely and return it to our facility using the provided shipping label.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#0A3D2A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div>
                        <h5 className="font-semibold text-slate-800">Inspection & Processing</h5>
                        <p className="text-slate-700 text-sm">We will inspect the returned product and process your refund or replacement.</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Return Requirements</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h5 className="font-semibold text-amber-800 mb-3">Important Return Conditions</h5>
                    <ul className="list-disc list-inside text-amber-700 space-y-2 text-sm">
                      <li>Product must be in original condition and packaging</li>
                      <li>All original accessories and documentation must be included</li>
                      <li>Product must not show signs of use, damage, or modification</li>
                      <li>Return authorization number must be clearly visible on the package</li>
                      <li>Product must be returned using our provided shipping method</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Refund Policy</h3>
                  
                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Refund Eligibility</h4>
                  <p className="text-slate-700 mb-4">
                    Refunds will be processed for:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Damaged or defective products</li>
                    <li>Products that don&apos;t match specifications</li>
                    <li>Wrong products delivered</li>
                    <li>Manufacturing defects</li>
                    <li>Service cancellations before work begins</li>
                  </ul>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Refund Processing</h4>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-slate-800">Processing Time</h5>
                          <p className="text-slate-700 text-sm">3-5 business days after product inspection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-slate-800">Refund Method</h5>
                          <p className="text-slate-700 text-sm">Same method as original payment (credit card, bank transfer, etc.)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-[#0A3D2A] mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-slate-800">Bank Processing</h5>
                          <p className="text-slate-700 text-sm">Additional 3-7 business days for bank processing</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Partial Refunds</h4>
                  <p className="text-slate-700 mb-6">
                    Partial refunds may be issued in the following cases:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Product returned with minor damage or missing accessories</li>
                    <li>Service partially completed before cancellation</li>
                    <li>Restocking fees for non-defective returns</li>
                    <li>Shipping and handling costs for non-defective returns</li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">Note</h5>
                        <p className="text-blue-700 text-sm">
                          Standard returns have no restocking fee. A restocking charge may apply only in rare cases, such as missing accessories or product damage.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Non-Refundable Items</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-red-800 mb-3">Items Not Eligible for Return/Refund</h4>
                    <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                      <li>Custom-made or personalized products</li>
                      <li>Products with signs of use, damage, or modification</li>
                      <li>Products returned after the specified timeframe</li>
                      <li>Products without proper return authorization</li>
                      <li>Services that have been completed</li>
                      <li>Digital products or downloadable content</li>
                      <li>Products purchased from third-party sellers</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Warranty Information</h3>
                  
                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Product Warranty</h4>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-slate-800">Standard Warranty</h5>
                        <p className="text-slate-700 text-sm">1 year on all portable office solutions</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800">Extended Warranty</h5>
                        <p className="text-slate-700 text-sm">Available for purchase (2-5 years)</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Warranty Coverage</h4>
                  <p className="text-slate-700 mb-4">
                    Our warranty covers:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Manufacturing defects in materials and workmanship</li>
                    <li>Structural integrity issues</li>
                    <li>Electrical and plumbing system defects</li>
                    <li>Door and window mechanism failures</li>
                    <li>Roof and wall panel defects</li>
                  </ul>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Warranty Exclusions</h4>
                  <p className="text-slate-700 mb-6">
                    Warranty does not cover:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Normal wear and tear</li>
                    <li>Damage from misuse or accidents</li>
                    <li>Damage from natural disasters</li>
                    <li>Unauthorized modifications or repairs</li>
                    <li>Cosmetic damage from normal use</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Exchange Policy</h3>
                  <p className="text-slate-700 mb-4">
                    We offer product exchanges for:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                    <li>Different size or configuration of the same product</li>
                    <li>Different color or finish options</li>
                    <li>Upgrades to higher-tier models</li>
                    <li>Products with minor defects (repaired or replaced)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Contact Information</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <p className="text-slate-700 mb-4">
                      For returns, refunds, or warranty claims:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Customer Service:</strong> +91 88616 22859
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Email:</strong> sales@samanportable.com
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#0A3D2A]" />
                        <span className="text-slate-700">
                          <strong>Warranty Claims:</strong> +91 88616 22859
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Need Help with Returns?</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Our customer service team is here to help you with any questions about returns, refunds, or warranty claims.
                    </p>
                    <Button className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90">
                      Contact Customer Service
                    </Button>
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

