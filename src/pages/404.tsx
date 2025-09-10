import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Home, Search, ArrowLeft, Mail } from 'lucide-react';

const Custom404Page = () => {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | Saman Portable</title>
        <meta name="description" content="The page you're looking for doesn't exist. Find portable office solutions and container cabins." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          {/* Main Error Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center mb-8">
            <div className="mb-8">
              {/* 404 Number */}
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-6">
                404
              </div>
              
              {/* Error Message */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                Don&apos;t worry, we have plenty of portable office solutions waiting for you!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/">
                <Button className="w-full sm:w-auto" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              
              <Link href="/product">
                <Button variant="outline" className="w-full sm:w-auto" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Search Suggestion */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Looking for something specific?
              </h3>
              <p className="text-slate-600 mb-4">
                Try searching for portable cabins, container offices, or contact us for custom solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/product/portable-cabin">
                  <Button variant="secondary" size="sm">
                    Portable Cabins
                  </Button>
                </Link>
                <Link href="/product/container-office">
                  <Button variant="secondary" size="sm">
                    Container Offices
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Need Help? Contact Our Team
            </h2>
            <div className="flex justify-center">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 max-w-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">Email Us</h3>
                <p className="text-slate-600">
                  sales@samanportable.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404Page;

