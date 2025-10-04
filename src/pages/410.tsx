import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';

const Custom410Page = () => {
  return (
    <Layout>
      <Head>
        <title>410 Gone - Resource Removed | Saman Portable</title>
        <meta name="description" content="This resource has been intentionally removed." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-gray-300 mb-4">410</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Resource Removed</h1>
            <p className="text-gray-600 mb-6">
              This resource has been intentionally removed and is no longer available.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Set the proper 410 status code
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 410;
  return {
    props: {},
  };
};

export default Custom410Page;

