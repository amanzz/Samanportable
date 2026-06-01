import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  Send,
  CheckCircle,
  Loader2,
  MapPin
} from 'lucide-react';

interface QuoteFormProps {
  variant?: 'default' | 'popup' | 'hero';
  onClose?: () => void;
}

const QuoteForm = ({ variant = 'default', onClose }: QuoteFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    region: '',
    projectDetails: ''
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

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          region: formData.region,
          projectDetails: formData.projectDetails,
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          company: '',
          service: '',
          region: '',
          projectDetails: ''
        });
        if (onClose) onClose();
      }, 3000);

    } catch (error) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const products = [
    'MS Porta Cabin',
    'Container Office',
    'Prefab Labor Colony',
    'Portable Office',
    'PEB Buildings',
    'Portable Toilets and Security',
    'Container Cafes'
  ];

  if (submitted) {
    return (
      <div className="bg-white border rounded-lg p-4 text-center shadow-lg">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-black mb-2">Quote Request Sent Successfully!</h3>
        <p className="text-black text-sm">
          Thank you for your interest. We&apos;ll get back to you with a detailed quote within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className={`quote-form ${variant === 'popup' ? 'bg-transparent' : 'bg-white rounded-2xl shadow-2xl border-t-4 border-[#0A3D2A] p-4 sm:p-6'}`}>
      {variant !== 'popup' && (
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A3D2A] mb-1">Get a Free Quote</h2>
          <p className="text-gray-600 text-xs">Fill out the form below and we&apos;ll get back to you</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700 block text-left">
              First Name *
            </Label>
            <div className="relative group">
              <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-[#0A3D2A] transition-colors duration-200" />
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="First Name"
                className="pl-7 border-gray-300 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 h-9 text-xs text-gray-900 bg-white placeholder-gray-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700 block text-left">
              Last Name *
            </Label>
            <div className="relative group">
              <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-[#0A3D2A] transition-colors duration-200" />
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Last Name"
                className="pl-7 border-gray-300 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 h-9 text-xs text-gray-900 bg-white placeholder-gray-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 block text-left">
              Phone Number *
            </Label>
            <div className="relative group">
              <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-[#0A3D2A] transition-colors duration-200" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Your phone number"
                className="pl-7 border-gray-300 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 h-9 text-xs text-gray-900 bg-white placeholder-gray-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-700 block text-left">
              Email Address *
            </Label>
            <div className="relative group">
              <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-[#0A3D2A] transition-colors duration-200" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
                className="pl-7 border-gray-300 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 h-9 text-xs text-gray-900 bg-white placeholder-gray-500 rounded-md transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="service" className="text-xs font-semibold text-gray-700 block text-left">
              Products *
            </Label>
            <div className="relative group">
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
                aria-label="Select a product"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 placeholder-gray-500 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 bg-white h-9 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 group-focus-within:border-[#0A3D2A]"
              >
                <option value="" className="text-gray-600">-Select-</option>
                {products.map((product) => (
                  <option key={product} value={product} className="text-gray-900">
                    {product}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="region" className="text-xs font-semibold text-gray-700 block text-left">
              Region
            </Label>
            <div className="relative group">
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                aria-label="Select region"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 placeholder-gray-500 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 bg-white h-9 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 group-focus-within:border-[#0A3D2A]"
              >
                <option value="" className="text-gray-600">-Select-</option>
                <option value="South India" className="text-gray-900">South India</option>
                <option value="North India" className="text-gray-900">North India</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="projectDetails" className="text-xs font-semibold text-gray-700 block text-left">
            Write your requirement *
          </Label>
          <Textarea
            id="projectDetails"
            name="projectDetails"
            value={formData.projectDetails}
            onChange={handleInputChange}
            required
            rows={2}
            placeholder="..."
            className="border-gray-300 focus:border-[#0A3D2A] focus:ring-[#0A3D2A] focus:ring-opacity-20 resize-none text-xs text-gray-900 bg-white placeholder-gray-500 rounded-md min-h-[60px] transition-all duration-200 hover:border-gray-400"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0A3D2A] to-[#1a5f3a] hover:from-[#1a5f3a] hover:to-[#0A3D2A] text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 h-9 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          size="default"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1" />
              Submit
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default QuoteForm;
