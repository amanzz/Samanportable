import Layout from '@/components/Layout';
import { Button } from '../components/ui/button';
import QuoteForm from '../components/QuoteForm';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock
} from 'lucide-react';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { pageSEO, siteConfig } from '@/config/seo';

const ContactPage = () => {
  // Structured data object moved to pass via UnifiedSEO
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": pageSEO.contact.title,
    "description": pageSEO.contact.description,
    "url": pageSEO.contact.canonical,
    "mainEntity": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url,
      "logo": siteConfig.ogImage,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-88616-22859",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": "English"
        }
      ],
      "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "I, Sy No 34/2, near India Oil petrol pump, Gopasandra",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "postalCode": "560099",
          "addressCountry": "IN"
        }
      ]
    },
    "author": {
      "@type": "Organization",
      "name": siteConfig.name
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": siteConfig.ogImage
      }
    }
  };

  const contactInfo = [
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: Closed'
    }
  ];

  const branchInfo = [
    {
      name: 'Bangalore Branch',
      address: 'I, Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099',
      phone: ['+91 88616 22859', '+91 80886 85440'],
      email: 'sales@samanportable.com',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15556.703211516599!2d77.7291942!3d12.8509838!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d55f6f82ca7%3A0xf28e36c870c3ef6a!2sSAMAN%20Portable%20Office%20Solutions%20Private%20Limited!5e0!3m2!1sen!2sin!4v1712400000000!5m2!1sen!2sin'
    },
    {
      name: 'Greater Noida Branch',
      address: 'Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308',
      phone: ['+91 8796039938', '+91 9708989937'],
      email: 'ncr@samanportable.com',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.586582617375!2d77.43468027890346!3d28.55214352511481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9cb67686ca3%3A0x9848ba80412bf2ea!2sSAMAN%20POS%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1755245548890!5m2!1sen!2sin'
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.contact.title}
        fallbackDescription={pageSEO.contact.description}
        fallbackCanonical={pageSEO.contact.canonical}
        keywords={pageSEO.contact.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={contactStructuredData}
      />

      {/* Removed duplicate Head meta tags in favor of UnifiedSEO */}
      <main className="bg-background">
        {/* Hero Section */}
        <section className="relative py-12 bg-[#0A3D2A]">
          <div className="max-w-7xl mx-auto container-padding text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Ready to start your project? Have questions about our services? We&apos;d love to hear from you.
              Our team is here to help bring your vision to life.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Quote Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Get a Free Quote</h2>
              <QuoteForm variant="default" />
            </div>

                         {/* Contact Information */}
             <div>
               <h2 className="text-3xl font-bold text-foreground mb-6">Contact Information</h2>
               
               <div className="space-y-4">
                 {contactInfo.map((info, index) => (
                   <div key={index} className="flex items-start space-x-3">
                     <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                       <info.icon className="w-6 h-6 text-primary" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                       <p className="text-muted-foreground whitespace-pre-line">{info.details}</p>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Branch Information */}
               <div className="mt-8 space-y-6">
                 <h3 className="text-xl font-semibold text-foreground mb-4">Our Branches</h3>
                 
                 {branchInfo.map((branch, index) => (
                   <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
                     <div className="flex items-start space-x-3 mb-4">
                       <div className="w-10 h-10 bg-[#0A3D2A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                         <MapPin className="w-5 h-5 text-green-600" />
                       </div>
                       <div>
                         <h4 className="font-semibold text-foreground text-lg">{branch.name}</h4>
                         <p className="text-muted-foreground text-sm">{branch.address}</p>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                       <div>
                         <div className="flex items-center space-x-2 mb-2">
                           <Phone className="w-4 h-4 text-green-600" />
                           <span className="font-medium text-foreground">Phone:</span>
                         </div>
                         <div className="space-y-1">
                           {branch.phone.map((phone, phoneIndex) => (
                             <a 
                               key={phoneIndex}
                               href={`tel:${phone.replace(/\s/g, '')}`}
                               className="block text-muted-foreground hover:text-green-600 transition-colors"
                             >
                               {phone}
                             </a>
                           ))}
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex items-center space-x-2 mb-2">
                           <Mail className="w-4 h-4 text-green-600" />
                           <span className="font-medium text-foreground">Email:</span>
                         </div>
                         <a 
                           href={`mailto:${branch.email}`}
                           className="text-muted-foreground hover:text-green-600 transition-colors"
                         >
                           {branch.email}
                         </a>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

                             {/* Quick Contact */}
               <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                 <h3 className="text-xl font-semibold text-foreground mb-4">Need Immediate Assistance?</h3>
                 <p className="text-muted-foreground mb-4">
                   For urgent inquiries or immediate support, call us directly:
                 </p>
                 <div className="space-y-2">
                    <Button 
                      onClick={() => window.location.href = 'tel:+918861622859'}
                      className="w-full"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now: +91 88616 22859
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = 'mailto:sales@samanportable.com'}
                      className="w-full"
                      size="lg"
                    >
                     <Mail className="w-4 h-4 mr-2" />
                     Email: sales@samanportable.com
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Find Our Branches</h2>
              <p className="text-xl text-muted-foreground">
                Visit our offices to discuss your project in person
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {branchInfo.map((branch, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-foreground mb-2">{branch.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{branch.address}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{branch.phone[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{branch.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-80">
                    <iframe 
                      src={branch.mapEmbed}
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${branch.name} Location`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">What areas do you serve?</h3>
                <p className="text-muted-foreground">
                  We primarily serve Bangalore and surrounding areas in Karnataka, but we can accommodate projects across India depending on the scope and requirements.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">How long does delivery take?</h3>
                <p className="text-muted-foreground">
                  Standard delivery times range from 7–21 days for custom orders. We also have ready-to-ship options available for immediate delivery.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Do you provide installation services?</h3>
                <p className="text-muted-foreground">
                  Yes, we provide complete installation and setup services. Our experienced team handles everything from site preparation to final inspection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer is now handled by Layout */}
    </Layout>
  );
};

export default ContactPage;
