import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram
} from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const Footer = () => {
  return (
    <footer className="bg-black text-white relative z-20 pb-16 lg:pb-0">
      {/* Main Footer Content - 5 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Column 1: Company Information */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Image 
                  src="/saman-logo.svg"
                  alt="SAMAN Portable Logo"
                  width={200}
                  height={40}
                  className="h-8 w-auto object-contain"
                  unoptimized
                />
              </div>
            </div>
            
            {/* Company Description */}
            <p className="text-gray-300 text-xs leading-relaxed mb-4">
              Saman Portable offers durable, modular, and maintenance-free buildings, designed with high-quality materials for reliability and long-term performance.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/p/SAMAN-Portable-Office-Solutions-is-leading-manufacturer-of-Porta-Cabins-100067811252556/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-blue-500 transition-colors"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a 
                href="https://x.com/Saman_Portable" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-blue-400 transition-colors"
              >
                <Twitter className="w-3 h-3" />
              </a>
              <a 
                href="https://www.instagram.com/pos_containerhomes/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-pink-400 transition-colors"
              >
                <Instagram className="w-3 h-3" />
              </a>
              <a 
                href="https://in.pinterest.com/samanportablecabins/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-red-600 transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.017 12.017.017z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors text-xs">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/rental-services" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Rental Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/product-category/portable-cabin" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Portable Cabin
                </Link>
              </li>
              <li>
                <Link href="/product-category/container-offices" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Container Offices
                </Link>
              </li>
              <li>
                <Link href="/product-category/porta-cabins" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Porta Cabins
                </Link>
              </li>
              <li>
                <Link href="/product-category/labor-colony" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Labor Colony
                </Link>
              </li>
              <li>
                <Link href="/product-category/portable-office" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Portable Office
                </Link>
              </li>
              <li>
                <Link href="/product-category/container-cafe" className="text-gray-300 hover:text-white transition-colors text-xs">
                  Container Cafe
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Manufacturing Unit - 1 */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Manufacturing Unit - 1</h3>
            <div className="bg-black rounded-lg p-3 space-y-2 min-w-0 border border-gray-800">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <p className="text-white text-xs leading-relaxed break-words">
                  I, Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <a href="tel:+918861622859" className="text-white text-xs break-all hover:text-green-300 transition-colors">
                  +91 88616 22859
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <a href="tel:+918088685440" className="text-white text-xs break-all hover:text-green-300 transition-colors">
                  +91 80886 85440
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-xs break-all">sales@samanportable.com</p>
              </div>
            </div>
          </div>

          {/* Column 5: Manufacturing Unit - 2 */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Manufacturing Unit - 2</h3>
            <div className="bg-black rounded-lg p-3 space-y-2 min-w-0 border border-gray-800">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <p className="text-white text-xs leading-relaxed break-words">
                  Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <a href="tel:+918796039938" className="text-white text-xs break-all hover:text-green-300 transition-colors">
                  +91 8796039938
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <a href="tel:+919708989937" className="text-white text-xs break-all hover:text-green-300 transition-colors">
                  +91 9708989937
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-xs break-all">ncr@samanportable.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Policies */}
      <div className="border-t border-gray-700 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-xs">
              © {new Date().getFullYear()} SAMAN Portable Office Solutions. All rights reserved.
            </div>
            
            {/* Policy Links */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer block py-1 px-2 rounded hover:bg-gray-800">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer block py-1 px-2 rounded hover:bg-gray-800">
                Terms and Conditions
              </Link>
              <Link href="/delivery-policy" className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer block py-1 px-2 rounded hover:bg-gray-800">
                Delivery Policy
              </Link>
              <Link href="/refund-and-return-policy" className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer block py-1 px-2 rounded hover:bg-gray-800">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

