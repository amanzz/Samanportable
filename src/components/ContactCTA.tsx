import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';

const ContactCTA = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91-XXXXXXXXXX',
      description: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email Us',
      value: 'info@samanportable.com',
      description: 'Quick response guaranteed'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Bangalore, Karnataka',
      description: 'Main office location'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 9AM - 6PM',
      description: 'Sunday: Closed'
    }
  ];

  return (
    <section className="section-padding bg-[#0A3D2A] text-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Contact us today for a free consultation and quote on your portable office project. 
            Our expert team is ready to help you find the perfect solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {info.title}
              </h3>
              <p className="text-lg font-medium mb-1">
                {info.value}
              </p>
              <p className="text-sm opacity-80">
                {info.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Get Your Free Quote Today
            </h3>
            <p className="text-lg opacity-90 mb-8">
              Fill out the form and our team will get back to you within 24 hours with a 
              customized quote for your portable office needs.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                <span>Free consultation and site visit</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                <span>Customized solutions for your needs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                <span>Competitive pricing and financing options</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                <span>Professional installation and support</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h4 className="text-xl font-semibold mb-6 text-center">
              Request Quote
            </h4>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <label htmlFor="service" className="sr-only">Select Product</label>
              <select 
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">Select Product</option>
                <option value="Portable Cabin">Portable Cabin</option>
                <option value="Container Offices">Container Offices</option>
                <option value="Porta Cabins">Porta Cabins</option>
                <option value="Labor Colony">Labor Colony</option>
                <option value="Portable Offices">Portable Offices</option>
                <option value="Container Cafe">Container Cafe</option>
                <option value="Container Marketing Office">Container Marketing Office</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your project requirements..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              ></textarea>
              {submitted ? (
                <div className="bg-white border rounded-lg p-4 text-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-black text-sm">Thank you! We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-foreground hover:bg-gray-100 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Get Free Quote'
                  )}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

