import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  Building2,
  Wrench,
  Truck,
  ChevronDown,
  Menu,
  X,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';
import QuoteForm from '@/components/QuoteForm';
import SmartImage from '@/components/SmartImage';
import FAQSchema from '@/components/FAQSchema';
import CategoryMenu from '@/components/CategoryMenu';

const PrefabSolutionsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  // Track active section for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'why-prefab', 'solutions', 'work', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'why-prefab', label: 'Why Prefab' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'work', label: 'Work' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  const whyPrefabFeatures = [
    {
      icon: <Clock className="w-8 h-8 text-[#06261A]" />,
      title: "50% Faster Construction",
      description: "Prefab solutions reduce construction time by up to 50% compared to traditional methods."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#06261A]" />,
      title: "Weather Resistant",
      description: "Built to withstand harsh weather conditions with superior durability and protection."
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#06261A]" />,
      title: "Easy Installation",
      description: "Quick and easy installation process with minimal site disruption and faster setup."
    },
    {
      icon: <Users className="w-8 h-8 text-[#06261A]" />,
      title: "Cost Effective",
      description: "Significant cost savings through reduced labor, materials, and construction time."
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#06261A]" />,
      title: "Modular Design",
      description: "Flexible and scalable solutions that can be easily expanded or relocated as needed."
    },
    {
      icon: <Globe className="w-8 h-8 text-[#06261A]" />,
      title: "Eco-Friendly",
      description: "Sustainable construction with reduced waste and environmental impact."
    }
  ];

  const containerSolutions = [
    {
      image: "/Prefab solutions/portable cabin.webp",
      title: "Portable Cabin",
      description: "Versatile and mobile cabin solutions perfect for temporary offices, construction sites, and remote locations.",
      features: ["Portable", "Quick Setup", "Weather Resistant", "Cost Effective"]
    },
    {
      image: "/Prefab solutions/container office.webp",
      title: "Container Offices",
      description: "Modern, fully-equipped office spaces built from shipping containers with all amenities.",
      features: ["Air Conditioning", "Electrical Setup", "Insulation", "Security Features"]
    },
    {
      image: "/Prefab solutions/porta cabin.webp",
      title: "Porta Cabins",
      description: "Durable and flexible cabin solutions for construction sites, temporary offices, and various applications.",
      features: ["Durable", "Flexible", "Easy Installation", "Modular Design"]
    },
    {
      image: "/Prefab solutions/labor colony.webp",
      title: "Labor Colony",
      description: "Complete housing solutions for labor accommodation with all necessary facilities and amenities.",
      features: ["Complete Housing", "All Amenities", "Safe & Secure", "Comfortable Living"]
    },
    {
      image: "/Prefab solutions/portable office.webp",
      title: "Portable Offices",
      description: "Professional office spaces that can be quickly deployed anywhere with modern facilities.",
      features: ["Professional Setup", "Modern Facilities", "Quick Deployment", "Fully Equipped"]
    },
    {
      image: "/Prefab solutions/container cafe.webp",
      title: "Container Cafe",
      description: "Unique and attractive cafe spaces built from containers, perfect for food service businesses.",
      features: ["Unique Design", "Attractive", "Food Service Ready", "Customizable"]
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "ABC Construction Ltd.",
      role: "Project Manager",
      content: "Saman Portable's prefab solutions helped us complete our project 40% faster than expected. The quality is outstanding and the team is very professional.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      company: "TechCorp India",
      role: "Operations Director",
      content: "We needed a quick office solution and Saman delivered beyond our expectations. The container office is modern, comfortable, and cost-effective.",
      rating: 5
    },
    {
      name: "Amit Patel",
      company: "Healthcare Plus",
      role: "Facility Manager",
      content: "The healthcare facility they built for us meets all medical standards and was ready in record time. Highly recommended for any healthcare project.",
      rating: 5
    }
  ];

  const comparisonData = [
    {
      feature: "Construction Time",
      prefab: "7–21 days",
      traditional: "3-6 months",
      advantage: "50% faster"
    },
    {
      feature: "Cost Efficiency",
      prefab: "30-40% savings",
      traditional: "Standard costs",
      advantage: "Significant savings"
    },
    {
      feature: "Weather Dependency",
      prefab: "Minimal impact",
      traditional: "High impact",
      advantage: "Year-round construction"
    },
    {
      feature: "Quality Control",
      prefab: "Factory controlled",
      traditional: "Site dependent",
      advantage: "Consistent quality"
    },
    {
      feature: "Waste Generation",
      prefab: "Minimal waste",
      traditional: "High waste",
      advantage: "Eco-friendly"
    },
    {
      feature: "Relocation",
      prefab: "Easily relocatable",
      traditional: "Permanent",
      advantage: "Flexible solutions"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "We discuss your requirements, site conditions, and project specifications to understand your needs.",
      icon: <Users className="w-8 h-8 text-white" />
    },
    {
      step: "02",
      title: "Design",
      description: "Our team creates detailed 3D designs and blueprints tailored to your specific requirements.",
      icon: <Building2 className="w-8 h-8 text-white" />
    },
    {
      step: "03",
      title: "Fabrication",
      description: "High-quality prefabrication in our controlled factory environment ensuring precision and quality.",
      icon: <Wrench className="w-8 h-8 text-white" />
    },
    {
      step: "04",
      title: "Delivery",
      description: "Professional installation and setup at your site with complete project handover and support.",
      icon: <Truck className="w-8 h-8 text-white" />
    }
  ];

  const faqData = [
    {
      question: "How long does it take to complete a prefab project?",
      answer: "Most prefab projects can be completed in 7–21 days, which is significantly faster than traditional construction methods that typically take 3-6 months."
    },
    {
      question: "Are prefab structures as durable as traditional buildings?",
      answer: "Yes, prefab structures are built with high-quality materials and often exceed traditional construction standards. They are designed to last for decades with proper maintenance."
    },
    {
      question: "Can prefab structures be customized?",
      answer: "Absolutely! Our prefab solutions are highly customizable. We can modify layouts, add features, change colors, and adapt designs to meet your specific requirements."
    },
    {
      question: "What about permits and approvals?",
      answer: "We handle all necessary permits and approvals for your prefab project. Our team is experienced in navigating local regulations and ensuring compliance."
    },
    {
      question: "Do you provide maintenance services?",
      answer: "Yes, we offer comprehensive maintenance services to keep your prefab structure in excellent condition. We provide both scheduled maintenance and emergency repairs."
    },
    {
      question: "Can prefab structures be relocated?",
      answer: "One of the major advantages of prefab structures is their portability. They can be easily disassembled, moved, and reassembled at a new location."
    }
  ];

  return (
    <div className="page-container min-h-screen overflow-x-hidden">
      <Head>
        <title>Container Office Manufacturer India | Porta Cabin Supplier | Saman Portable</title>
        <meta name="description" content="India&apos;s #1 Container Office & Porta Cabin Manufacturer. Ready in 7–21 days. Manufactured using quality-tested steel and industry-standard processes. Free Installation. All India Delivery. Get instant quote for container offices, porta cabins, labor colonies." />
        <meta name="keywords" content="prefab solutions India, container offices Bangalore, porta cabins, labor colonies, portable offices, container cafes, prefab construction, modular buildings, construction cabins, healthcare facilities, event spaces, storage solutions, Saman Portable" />
        <meta name="author" content="Saman Portable" />
        <meta name="publisher" content="Saman Portable" />
        <meta property="og:title" content="Prefab Solutions India | Saman Portable - Modern Container & Portable Buildings" />
        <meta property="og:description" content="Transform your space with India&apos;s leading prefab solutions. Container offices, porta cabins, labor colonies & more. Fast, reliable, cost-effective building solutions with free consultation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.samanportable.com/prefab-solutions" />
        <meta property="og:image" content="https://samanportable.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prefab Solutions India | Saman Portable" />
        <meta name="twitter:description" content="India&apos;s leading prefab solutions provider. Container offices, porta cabins, labor colonies & more. 50% faster construction with free quote." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://www.samanportable.com/prefab-solutions" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              overflow-x: hidden;
              scroll-behavior: smooth;
              height: auto;
              min-height: 100vh;
            }
            body {
              min-height: 100vh;
              position: relative;
            }
            #__next {
              min-height: 100vh;
              display: block;
            }
            .page-container {
              min-height: 100vh;
              display: block;
            }
            @media (max-width: 768px) {
              .page-container {
                padding-bottom: 0px;
              }
            }
          `
        }} />
      </Head>

      <FAQSchema faqs={faqData} productTitle="Prefab Solutions" />

      {/* Custom Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Image
                  src="/saman-logo.svg"
                  alt="Saman Portable"
                  width={120}
                  height={30}
                  className="h-8 w-auto"
                  unoptimized
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeSection === item.id
                      ? 'text-[#06261A] bg-gray-100'
                      : 'text-gray-700 hover:text-[#06261A] hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#06261A] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#06261A]"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${activeSection === item.id
                    ? 'text-[#06261A] bg-gray-100'
                    : 'text-gray-700 hover:text-[#06261A] hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Shared 14-hub category navigation for SEO consistency */}
      <CategoryMenu />

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMjY2MTAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#06261A]/10 text-[#06261A] text-sm font-medium mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  India&apos;s Leading Prefab Solutions Provider
                </div>

                <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-[#06261A] bg-gradient-to-r from-[#06261A] to-[#0A3D2A] bg-clip-text text-transparent">Container Offices</span>, <span className="text-[#06261A] bg-gradient-to-r from-[#06261A] to-[#0A3D2A] bg-clip-text text-transparent">Porta Cabins</span> & <span className="text-[#06261A] bg-gradient-to-r from-[#06261A] to-[#0A3D2A] bg-clip-text text-transparent">Prefab Buildings</span> in India
                </h1>
                <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                  India&apos;s #1 manufacturer of container offices, porta cabins, labor colonies & portable buildings. 50% faster delivery, 30% cost savings, 100% quality guarantee.
                </p>
              </div>

              {/* Quick Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="bg-[#06261A]/10 p-2 rounded-lg">
                    <Check className="w-5 h-5 text-[#06261A]" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">Ready in 7–21 Days</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="bg-[#06261A]/10 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-[#06261A]" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">Quality-tested Construction</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="bg-[#06261A]/10 p-2 rounded-lg">
                    <Wrench className="w-5 h-5 text-[#06261A]" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">Free Installation</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="bg-[#06261A]/10 p-2 rounded-lg">
                    <Globe className="w-5 h-5 text-[#06261A]" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">All India Delivery</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <QuoteFormTrigger className="shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Container Office Quote
                </QuoteFormTrigger>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => scrollToSection('solutions')}
                  className="border-[#06261A] text-[#06261A] hover:bg-[#06261A] hover:text-white bg-white/60 backdrop-blur-sm hover:bg-[#06261A] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Container Offices
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Content - Quote Form */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#06261A]/20 to-[#0A3D2A]/20 rounded-2xl blur-xl"></div>
              <div className="relative">
                <QuoteForm variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDI2NjEwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjxwYXRoIGQ9Ik0yMCAyMGMwLTExLjA0Ni04Ljk1NC0yMC0yMC0ydjIwaDIweiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#06261A]/10 text-[#06261A] text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              India&apos;s #1 Container Office Manufacturer
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by 500+ Companies for Container Offices</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">See what our clients say about our container offices, porta cabins & prefab buildings. India&apos;s most trusted manufacturer.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="bg-[#06261A] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Secure & Reliable</h3>
              <p className="text-sm md:text-base text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="bg-[#06261A] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Industry Certified</h3>
              <p className="text-sm md:text-base text-gray-600">ISO certified quality</p>
            </div>
            <div className="text-center">
              <div className="bg-[#06261A] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">On-Time Delivery</h3>
              <p className="text-sm md:text-base text-gray-600">99% on-time completion</p>
            </div>
            <div className="text-center">
              <div className="bg-[#06261A] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Expert Team</h3>
              <p className="text-sm md:text-base text-gray-600">15+ years experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Prefab Solutions */}
      <section id="why-prefab" className="py-20 bg-gradient-to-br from-white via-gray-50 to-green-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMjY2MTAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTMwIDMwYzAtMTYuNTY5LTEzLjQzMS0zMC0zMC0zMHYzMGgzMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#06261A]/10 text-[#06261A] text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Modern Construction Technology
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Prefab Solutions?</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of modern prefab construction that make it the smart choice for your next project. Experience faster, more efficient, and cost-effective building solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPrefabFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-[#06261A]/20 hover:-translate-y-2"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-[#06261A]/10 to-[#0A3D2A]/10 p-4 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 group-hover:text-[#06261A] transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Container Solutions */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDI2NjEwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#06261A]/10 text-[#06261A] text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Complete Prefab Solutions
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Our Container Solutions</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of prefab solutions designed for various industries and applications. From portable cabins to container offices, we have everything you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {containerSolutions.map((solution, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 hover:border-[#06261A]/20 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">{solution.description}</p>

                  <div className="space-y-2 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-[#06261A] flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <QuoteFormTrigger variant="outline" size="sm" className="w-full">
                    Get Quote
                  </QuoteFormTrigger>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-base md:text-xl text-gray-600">See what our clients say about our prefab solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="border-t pt-4">
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs md:text-sm text-[#06261A] font-medium">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Why Prefab Beats Traditional Construction</h2>
            <p className="text-base md:text-xl text-gray-600">Compare the advantages of our prefab solutions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-[#06261A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm md:text-base font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-sm md:text-base font-semibold">Prefab Solutions</th>
                  <th className="px-6 py-4 text-center text-sm md:text-base font-semibold">Traditional Construction</th>
                  <th className="px-6 py-4 text-center text-sm md:text-base font-semibold">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm md:text-base font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm md:text-base text-[#06261A] font-semibold">{row.prefab}</td>
                    <td className="px-6 py-4 text-center text-sm md:text-base text-red-600 font-semibold">{row.traditional}</td>
                    <td className="px-6 py-4 text-center text-sm md:text-base text-green-600 font-semibold">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Our Work in Action */}
      <section id="work" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Our Work in Action</h2>
            <p className="text-base md:text-xl text-gray-600">See some of our successful prefab projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/Prefab solutions/work/portable-cabin-labour-colony-setup.webp", alt: "Portable cabin labour colony setup for construction projects" },
              { src: "/Prefab solutions/work/saman-portable-modular-office-cabin.webp", alt: "Saman Portable modular office cabin with custom finish" },
              { src: "/Prefab solutions/work/saman-prefab-container-office-unit.webp", alt: "Saman prefab container office unit ready for delivery" },
              { src: "/Prefab solutions/work/portable-cabin-site-office-bangalore.webp", alt: "Portable cabin site office setup in Bangalore by Saman Portable" },
              { src: "/Prefab solutions/work/container-office-exterior-india.webp", alt: "Modern container office exterior for industrial use in India" },
              { src: "/Prefab solutions/work/prefab-cabin-installation-worksite.webp", alt: "Prefab cabin installation at construction worksite by Saman Portable" }
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg">
                <div className="relative h-64 w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="white" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps to Custom Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Steps to Your Custom Solution</h2>
            <p className="text-base md:text-xl text-gray-600">Our streamlined process ensures your project is delivered on time and within budget</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="bg-[#06261A] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-[#06261A] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-[#06261A]">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDI2NjEwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIxIi8+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iMSIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iNzUiIHI9IjEiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjI1IiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#06261A]/10 text-[#06261A] text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Common Questions
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our prefab solutions and get clarity on your construction needs</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNjI2MUEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiLz48Y2lyY2xlIGN4PSI5MCIgY3k9Ijk wIiByPSIxIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI5MCIgcj0iMSIvPjxjaXJjbGUgY3g9Ijk wIiBjeT0iMzAiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-[#06261A]/10 backdrop-blur-sm text-[#06261A] text-sm font-medium mb-8 border border-[#06261A]/20">
              <Award className="w-5 h-5 mr-3" />
              India&apos;s Leading Prefab Solutions Provider
            </div>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">Ready to Start Your Project?</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Get in touch with our experts for a free consultation and personalized quote for your prefab solution needs. We&apos;re here to bring your vision to life.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-8">
              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-[#06261A]/40 transition-all duration-300 hover:bg-white/90 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="bg-gradient-to-br from-[#06261A]/20 to-[#06261A]/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-7 h-7 text-[#06261A]" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-sm md:text-base text-gray-600">Speak directly with our experts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="tel:+918861622859" className="block text-gray-900 font-semibold hover:text-[#06261A] transition-colors duration-300 text-base md:text-lg">+91 88616 22859</a>
                  <a href="tel:+918861622859" className="block text-gray-900 font-semibold hover:text-[#06261A] transition-colors duration-300 text-base md:text-lg">+91 88616 22859</a>
                  <a href="tel:+918088685440" className="block text-gray-900 font-semibold hover:text-[#06261A] transition-colors duration-300 text-base md:text-lg">+91 80886 85440</a>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-[#06261A]/40 transition-all duration-300 hover:bg-white/90 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="bg-gradient-to-br from-[#06261A]/20 to-[#06261A]/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-7 h-7 text-[#06261A]" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-sm md:text-base text-gray-600">Send us your requirements</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="mailto:sales@samanportable.com" className="block text-gray-900 font-semibold hover:text-[#06261A] transition-colors duration-300 text-base md:text-lg">sales@samanportable.com</a>
                  <a href="mailto:ncr@samanportable.com" className="block text-gray-900 font-semibold hover:text-[#06261A] transition-colors duration-300 text-base md:text-lg">ncr@samanportable.com</a>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-[#06261A]/40 transition-all duration-300 hover:bg-white/90 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="bg-gradient-to-br from-[#06261A]/20 to-[#06261A]/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-7 h-7 text-[#06261A]" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-sm md:text-base text-gray-600">Our manufacturing units</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-900 font-medium text-base md:text-lg">Unit 1: Gopasandra, Bengaluru</p>
                  <p className="text-gray-900 font-medium text-base md:text-lg">Unit 2: Greater Noida, UP</p>
                </div>
              </div>
            </div>

            {/* Quote Form */}
            <div className="lg:col-span-3">
              <div className="h-full">
                <QuoteForm variant="default" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden pb-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-16 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/saman-logo.svg"
                  alt="SAMAN Portable"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  unoptimized
                />
              </div>
              <p className="text-sm md:text-base text-gray-400 mb-6 max-w-md leading-relaxed">
                India&apos;s leading prefab solutions provider. We deliver innovative, sustainable, and cost-effective building solutions across the country.
              </p>
              <div className="flex space-x-4">
                <a href="tel:+918861622859" className="bg-[#06261A] hover:bg-[#0A3D2A] text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm md:text-base">Call Now</span>
                </a>
                <a href="mailto:sales@samanportable.com" className="border border-gray-600 hover:border-white text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm md:text-base">Email Us</span>
                </a>
              </div>
            </div>


            {/* Services */}
            <div>
              <h4 className="text-base md:text-lg font-semibold text-white mb-4">Our Products</h4>
              <ul className="space-y-3">
                <li><span className="text-sm md:text-base text-gray-400">Container Offices</span></li>
                <li><span className="text-sm md:text-base text-gray-400">Porta Cabins</span></li>
                <li><span className="text-sm md:text-base text-gray-400">Labor Colonies</span></li>
                <li><span className="text-sm md:text-base text-gray-400">Portable Offices</span></li>
                <li><span className="text-sm md:text-base text-gray-400">Container Cafes</span></li>
              </ul>
            </div>
          </div>

          {/* Keywords Section - Mobile Optimized */}
          <div className="mt-4 mb-3">
            <h4 className="text-base md:text-lg font-semibold text-white mb-2 text-center">Serving Across India</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {[
                "Best Container Office Solutions in Delhi",
                "Top Portable Cabin Manufacturers in Mumbai",
                "Leading Prefab Solutions in Bangalore",
                "Container Cafe Design in Chennai",
                "Labor Colony Construction in Hyderabad",
                "Portable Office Rentals in Pune",
                "Container Office Manufacturers in Kolkata",
                "Prefab Building Solutions in Ahmedabad",
                "Container Office Suppliers in Gurgaon",
                "Portable Cabin Solutions in Noida",
                "Best Container Office in Faridabad",
                "Prefab Construction in Ghaziabad"
              ].map((keyword, index) => (
                <div key={index} className="bg-gray-800/50 rounded p-1.5 text-center">
                  <span className="text-gray-300 text-xs md:text-sm">
                    {keyword}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-1">
              <span className="text-gray-500 text-xs md:text-sm">+ 18 more cities across India</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-3 md:pt-8 pb-0">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="text-gray-400 text-sm md:text-base text-center md:text-left">
                © 2024 SAMAN POS India Private Limited. All rights reserved.
              </div>

              <div className="flex flex-wrap gap-2 md:gap-6 justify-center md:justify-end">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Terms & Conditions
                </Link>
                <Link href="/delivery-policy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Delivery Policy
                </Link>
                <Link href="/refund-and-return-policy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

// FAQ Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-white/20 hover:border-[#06261A]/20 transition-all duration-300">
      <button
        className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-[#06261A]/5 hover:to-[#0A3D2A]/5 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#06261A] transition-colors duration-300 pr-4">{question}</span>
        <div className="bg-[#06261A]/10 p-2 rounded-lg group-hover:bg-[#06261A]/20 transition-colors duration-300">
          <ChevronDown
            className={`w-5 h-5 text-[#06261A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <p className="text-sm md:text-base text-gray-600 leading-relaxed pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default PrefabSolutionsPage;
