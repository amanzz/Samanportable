import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsAndConditions = () => {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.terms.title}
        fallbackDescription={pageSEO.terms.description}
        fallbackCanonical={pageSEO.terms.canonical}
        keywords={pageSEO.terms.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={[
          generateWebPageSchema({
            url: 'https://www.samanportable.com/terms-and-conditions',
            name: pageSEO.terms.title,
            description: pageSEO.terms.description,
          }),
          generateBreadcrumbSchema([
            { name: 'Home', url: 'https://www.samanportable.com/' },
            { name: 'Terms and Conditions', url: 'https://www.samanportable.com/terms-and-conditions' },
          ]),
        ]}
      />

      {/* remove next/head block if exists; content remains the same */}
      {/* Head tags handled by UnifiedSEO; removed duplicate Head block */}
      
      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-12 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Terms and Conditions
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Please read these terms and conditions carefully before using our services.
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

              {/* Terms and Conditions Content */}
              <div className="max-w-none">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-[#0A3D2A] mb-6">Terms and Conditions</h2>
                  
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 15, 2025
                  </p>

                  <p className="text-slate-700 mb-6">
                    These Terms and Conditions (&quot;Terms&quot;) govern your use of the SAMAN POS India Private Limited website and services. By accessing or using our services, you agree to be bound by these Terms.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">1. Acceptance of Terms</h3>
                  <p className="text-slate-700 mb-6">
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">2. Use License</h3>
                  <p className="text-slate-700 mb-4">
                    Permission is granted to temporarily download one copy of the materials (information or software) on SAMAN POS India Private Limited&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">3. Disclaimer</h3>
                  <p className="text-slate-700 mb-6">
                    The materials on SAMAN POS India Private Limited&apos;s website are provided on an &apos;as is&apos; basis. SAMAN POS India Private Limited makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">4. Limitations</h3>
                  <p className="text-slate-700 mb-6">
                    In no event shall SAMAN POS India Private Limited or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SAMAN POS India Private Limited&apos;s website, even if SAMAN POS India Private Limited or a SAMAN POS India Private Limited authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">5. Accuracy of Materials</h3>
                  <p className="text-slate-700 mb-6">
                    The materials appearing on SAMAN POS India Private Limited&apos;s website could include technical, typographical, or photographic errors. SAMAN POS India Private Limited does not warrant that any of the materials on its website are accurate, complete, or current. SAMAN POS India Private Limited may make changes to the materials contained on its website at any time without notice.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">6. Links</h3>
                  <p className="text-slate-700 mb-6">
                    SAMAN POS India Private Limited has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SAMAN POS India Private Limited of the site. Use of any such linked website is at the user&apos;s own risk.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">7. Modifications</h3>
                  <p className="text-slate-700 mb-6">
                    SAMAN POS India Private Limited may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">8. Governing Law</h3>
                  <p className="text-slate-700 mb-6">
                    These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">9. Service Terms</h3>
                  
                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Product Information</h4>
                  <p className="text-slate-700 mb-4">
                    While we strive to provide accurate product information, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
                  </p>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Pricing</h4>
                  <p className="text-slate-700 mb-4">
                    All prices are subject to change without notice. Prices do not include taxes, shipping, or handling charges unless otherwise stated.
                  </p>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Order Acceptance</h4>
                  <p className="text-slate-700 mb-6">
                    All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">10. Intellectual Property</h3>
                  <p className="text-slate-700 mb-6">
                    The Service and its original content, features, and functionality are and will remain the exclusive property of SAMAN POS India Private Limited and its licensors. The Service is protected by copyright, trademark, and other laws.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">11. User Conduct</h3>
                  <p className="text-slate-700 mb-4">
                    You agree not to use the Service to:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Transmit harmful, offensive, or inappropriate content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with the proper functioning of the Service</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">12. Termination</h3>
                  <p className="text-slate-700 mb-6">
                    We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">13. Contact Information</h3>
                  <p className="text-slate-700 mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="text-slate-700 mb-2">
                      <strong>Email:</strong> sales@samanportable.com
                    </p>
                    <p className="text-slate-700 mb-2">
                      <strong>Phone:</strong> +91 88616 22859
                    </p>
                    <p className="text-slate-700">
                      <strong>Address:</strong> I, Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099
                    </p>
                  </div>

                  <p className="text-slate-700 text-sm">
                    These Terms and Conditions are effective as of the date stated above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;

