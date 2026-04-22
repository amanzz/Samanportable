import React from 'react';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { GetStaticProps } from 'next';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';
import Link from 'next/link';
import { CheckCircle, Users, Award, Clock, Shield, Truck, ArrowRight, Compass, Building2, Leaf, HeartHandshake, Target, Zap } from 'lucide-react';
import { pageSEO, siteConfig } from '@/config/seo';

interface AboutUsProps {
  companyStats: {
    yearsExperience: number;
    projectsCompleted: number;
    happyCustomers: number;
    teamMembers: number;
  };
}

export const getStaticProps: GetStaticProps<AboutUsProps> = async () => {
  try {
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
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching data for about us page:', error);
    return {
      notFound: true,
      revalidate: 3600,
    };
  }
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
    { year: '2009', title: 'Company Founded', description: 'Started in Bangalore with a mission to make portable cabins and prefab offices accessible, durable, and sustainable for every business.' },
    { year: '2012', title: 'First Major Project', description: 'Successfully delivered 100+ porta cabins for industrial and construction clients across South India, marking our entry into large-scale modular manufacturing.' },
    { year: '2015', title: 'Expansion Milestone', description: 'Introduced container offices and prefab buildings, expanding production capacity and entering multi-state markets across Karnataka and Tamil Nadu.' },
    { year: '2018', title: 'Innovation Hub', description: 'Launched a dedicated R&D centre for advanced prefab technologies, PUF-panel development, and eco-smart construction systems.' },
    { year: '2021', title: 'Digital Transformation', description: 'Integrated smart IoT monitoring and BIM-based design systems, setting new benchmarks in portable construction efficiency and precision.' },
    { year: '2024', title: 'Market Leadership', description: 'Recognized as Bangalore’s top portable office manufacturer, serving 15+ states and completing 5,000+ successful installations across India.' }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.about.title}
        fallbackDescription={pageSEO.about.description}
        fallbackCanonical={pageSEO.about.canonical}
        fallbackOgImage="/about-us-hero.jpg"
        fallbackOgDescription="Inside Saman Portable—our mission, team, and quality promise."
        fallbackTwitterDescription="15+ years of portable cabins and prefab expertise across India."
        keywords={pageSEO.about.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      <div className="min-h-screen">

        <main>
          {/* Hero Section */}
          <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="max-w-7xl mx-auto container-padding relative z-20 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 hero-text-shadow">
                About Saman Portable
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 max-w-4xl mx-auto opacity-95">
                Building the Future of Modular Spaces
              </h2>
              <div className="text-lg md:text-xl max-w-4xl mx-auto opacity-90 space-y-4">
                <p>
                  Saman Portable is India’s trusted name in portable cabins, container offices, and prefab buildings. Since 2016, we’ve been transforming the way businesses and communities build — combining speed, sustainability, and modern design in every structure.
                </p>
                <p>
                  With ISO-certified quality, advanced PUF-panel engineering, and a 7–21 days delivery promise, we help clients across India create durable, ready-to-use spaces that perform beautifully and last for years.
                </p>
              </div>
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
                    Founded in 2009, Saman Portable Office Solutions began with a single goal — to make high-quality portable cabins and container offices accessible to every business, large or small. What started as a modest workshop in Bangalore has grown into one of India’s most trusted names in modular and prefabricated construction.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    Over the years, we’ve built more than 5,000 projects across India, combining engineering precision with a customer-first approach. Our commitment to innovation, sustainability, and performance has helped companies in construction, real estate, education, and manufacturing find faster, smarter space solutions.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Today, Saman Portable stands for design excellence and reliability, offering modular spaces that are built to last and delivered on time, every time.
                  </p>
                </div>
                <div className="bg-[#0A3D2A] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg mb-6 opacity-90">
                    To design and deliver sustainable, cost-effective, and technology-driven portable construction solutions that empower businesses to grow, adapt, and thrive in a dynamic world.
                  </p>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-lg opacity-90">
                    To be India’s leading force in modular construction, setting new benchmarks in quality, innovation, and customer satisfaction, while promoting eco-smart and energy-efficient building practices.
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

          {/* Our Expertise in Modular Construction */}
          <section className="section-padding bg-muted/30 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Expertise in Modular Construction
                </h2>
                <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Redefining portable infrastructure with precision engineering and sustainable design.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Precision & Innovation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We combine engineering precision with customer-first innovation. Every portable cabin, container café, and prefab home is crafted with attention to detail and tested materials.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Proven Scale & Quality</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    With 15+ years of expertise and 5,000+ completed projects, we ensure end-to-end control from fabrication to installation, meeting strict ISO and ISI standards.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Eco-Smart Construction</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use recyclable materials and energy-efficient insulation to reduce carbon impact. Partner with us to build spaces that are faster, smarter, and greener.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-primary rounded-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 group">
                  Explore our Portable Solutions
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* Our Journey */}
          <section className="section-padding bg-background">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Journey
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  From a single workshop to India’s most trusted modular construction brand — here’s how Saman Portable redefined portable space solutions through innovation, technology, and consistency.
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

          {/* Building Trust, Shaping the Future */}
          <section className="section-padding bg-muted/30 relative">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Building Trust, Shaping the Future
                </h2>
                <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Partnership */}
                <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Partnership First</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    At Saman Portable, we believe great construction begins with great relationships. Every project starts with listening — understanding not just space requirements, but the goals and challenges behind them. That’s how we turn modular design into something more meaningful: a partnership that builds lasting value.
                  </p>
                </div>

                {/* Card 2: Approach */}
                <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Tailored Precision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our approach is simple — precision where it matters, and flexibility where it counts. We invest continuously in design research, sustainable materials, and digital fabrication. From startups needing quick workspace solutions to national infrastructure leaders scaling across regions, we tailor every structure to fit their journey.
                  </p>
                </div>

                {/* Card 3: Future */}
                <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Future-Ready</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    As India moves toward smarter, greener construction, we’re not just following the shift — we’re shaping it. Saman Portable stands for accountability, innovation, and a promise that every structure we build will strengthen the people and purpose it serves.
                  </p>
                </div>
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

