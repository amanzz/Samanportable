import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { GetServerSideProps } from 'next';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';
import Link from 'next/link';
import { CheckCircle, Users, Award, Clock, Shield, Truck } from 'lucide-react';
import { pageSEO, siteConfig } from '@/config/seo';

interface AboutUsProps {
  companyStats: {
    yearsExperience: number;
    projectsCompleted: number;
    happyCustomers: number;
    teamMembers: number;
  };
}

export const getServerSideProps: GetServerSideProps<AboutUsProps> = async () => {
  // In a real implementation, you might fetch company stats from WordPress
  const companyStats = {
    yearsExperience: 15,
    projectsCompleted: 5000,
    happyCustomers: 3000,
    teamMembers: 200,
  };

  return {
    props: {
      companyStats,
    },
  };
};

const AboutUs = ({ companyStats }: AboutUsProps) => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards in materials and construction quality.'
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Fast turnaround times with efficient project management and execution.'
    },
    {
      icon: Shield,
      title: 'Durability',
      description: 'Built to last with premium materials and expert craftsmanship.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced professionals dedicated to delivering excellence.'
    },
    {
      icon: Truck,
      title: 'Installation Service',
      description: 'Complete installation and setup service included with every project.'
    },
    {
      icon: Award,
      title: 'Customer Support',
      description: '24/7 support and maintenance services for all our products.'
    }
  ];

  const milestones = [
    { year: '2009', title: 'Company Founded', description: 'Started with a vision to revolutionize portable construction' },
    { year: '2012', title: 'First Major Project', description: 'Successfully completed 100+ porta cabin installations' },
    { year: '2015', title: 'Expansion', description: 'Extended services to container offices and prefab solutions' },
    { year: '2018', title: 'Innovation Hub', description: 'Launched R&D center for advanced construction techniques' },
    { year: '2021', title: 'Digital Transformation', description: 'Integrated smart technology in portable solutions' },
    { year: '2024', title: 'Market Leader', description: 'Recognized as Bangalore\'s top portable office provider' }
  ];

  return (
    <Layout>
      <SEO
        title={pageSEO.about.title}
        description={pageSEO.about.description}
        canonical={pageSEO.about.canonical}
        keywords={pageSEO.about.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        openGraph={{
          title: pageSEO.about.title,
          description: pageSEO.about.description,
          image: '/about-us-hero.jpg',
          url: pageSEO.about.canonical,
        }}
      />

      <div className="min-h-screen">
        
        <main>
          {/* Hero Section */}
          <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="max-w-7xl mx-auto container-padding relative z-20 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text-shadow">
                About Saman Portable
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Leading the portable construction revolution with innovation, quality, and customer satisfaction
              </p>
            </div>
          </section>

          {/* Company Stats */}
          <section className="section-padding bg-background">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {companyStats.yearsExperience}+
                  </div>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {companyStats.projectsCompleted}+
                  </div>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {companyStats.happyCustomers}+
                  </div>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {companyStats.teamMembers}+
                  </div>
                  <p className="text-muted-foreground">Team Members</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="section-padding bg-muted/30">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Our Story
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Founded in 2009, Saman Portable Office Solutions began with a simple yet powerful vision: 
                    to revolutionize the construction industry by making high-quality, portable office solutions 
                    accessible to businesses of all sizes.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    What started as a small workshop in Bangalore has grown into one of the region&apos;s most 
                    trusted names in portable construction. Our journey has been marked by continuous innovation, 
                    unwavering commitment to quality, and deep understanding of our customers&apos; evolving needs.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Today, we&apos;re proud to serve clients across Karnataka and beyond, delivering not just 
                    products, but complete solutions that transform how businesses think about office space.
                  </p>
                </div>
                <div className="bg-[#0A3D2A] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg mb-6 opacity-90">
                    To provide innovative, sustainable, and cost-effective portable construction solutions 
                    that empower businesses to grow and adapt in an ever-changing world.
                  </p>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-lg opacity-90">
                    To be the leading force in portable construction, setting industry standards for 
                    quality, innovation, and customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="section-padding bg-background">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose Saman Portable?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  We stand out in the industry with our commitment to quality, innovation, and customer satisfaction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300 group">
                    <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Journey */}
          <section className="section-padding bg-muted/30">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Journey
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  From humble beginnings to industry leadership - here&apos;s our story of growth and success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300 group">
                    <div className="text-3xl font-bold text-primary mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-[#0A3D2A] text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Work With Us?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join hundreds of satisfied customers who have transformed their business spaces 
                with our portable office solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuoteFormTrigger size="lg" className="bg-white text-foreground hover:bg-gray-100">
                  Get Free Quote
                </QuoteFormTrigger>
                <Link href="/gallery">
                  <Button variant="heroOutline" size="lg">
                    View Our Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        
      </div>
    </Layout>
  );
};

export default AboutUs;

