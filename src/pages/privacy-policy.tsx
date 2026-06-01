import React from 'react';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.privacyPolicy.title}
        fallbackDescription={pageSEO.privacyPolicy.description}
        fallbackCanonical={pageSEO.privacyPolicy.canonical}
        keywords={pageSEO.privacyPolicy.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative py-12 bg-[#0A3D2A]">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
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

              {/* Privacy Policy Content */}
              <div className="max-w-none">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-[#0A3D2A] mb-6">Privacy Policy</h2>
                  
                  <p className="text-slate-700 mb-4">
                    <strong>Last updated:</strong> January 15, 2025
                  </p>

                  <p className="text-slate-700 mb-6">
                    At Saman Portable, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Information We Collect</h3>
                  
                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Personal Information</h4>
                  <p className="text-slate-700 mb-4">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Fill out contact forms</li>
                    <li>Request quotes</li>

                    <li>Make inquiries about our services</li>
                    <li>Apply for employment</li>
                  </ul>
                  <p className="text-slate-700 mb-6">
                    This information may include your name, email address, phone number, company name, and any other information you choose to provide.
                  </p>

                  <h4 className="text-lg font-medium text-slate-800 mt-6 mb-3">Automatically Collected Information</h4>
                  <p className="text-slate-700 mb-4">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Referring website</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">How We Use Your Information</h3>
                  <p className="text-slate-700 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Provide and maintain our services</li>
                    <li>Respond to your inquiries and requests</li>

                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                    <li>Protect against fraud and abuse</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Information Sharing</h3>
                  <p className="text-slate-700 mb-6">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Service providers who assist us in operating our website and providing services</li>
                    <li>Legal authorities when required by law</li>
                    <li>Business partners with your explicit consent</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Data Security</h3>
                  <p className="text-slate-700 mb-6">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Your Rights</h3>
                  <p className="text-slate-700 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Object to processing of your information</li>

                  </ul>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Cookies and Tracking Technologies</h3>
                  <p className="text-slate-700 mb-6">
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Third-Party Links</h3>
                  <p className="text-slate-700 mb-6">
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Children&apos;s Privacy</h3>
                  <p className="text-slate-700 mb-6">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Changes to This Policy</h3>
                  <p className="text-slate-700 mb-6">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                  </p>

                  <h3 className="text-xl font-semibold text-[#0A3D2A] mt-8 mb-4">Contact Us</h3>
                  <p className="text-slate-700 mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
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
                    This Privacy Policy is effective as of the date stated above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
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

export default PrivacyPolicy;

