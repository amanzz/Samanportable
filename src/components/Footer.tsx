import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram,
  Navigation
} from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const MONEY_STRIP_LINKS = [
  { label: "Porta Cabin Price Guide", href: "/porta-cabin-price-a-complete-guide-2025" },
  { label: "Porta Cabin in Delhi NCR", href: "/porta-cabins-in-delhi-ncr" },
  { label: "Porta Cabin Sizes India", href: "/porta-cabin-sizes-and-specifications-in-india" },
  { label: "Porta Cabin in Noida", href: "/porta-cabin-in-noida" },
  { label: "Portable Cabin Bangalore Price", href: "/portable-cabin-price-in-bangalore" },
  { label: "Portable Cabins in Gurgaon", href: "/portable-cabins-in-gurgaon" },
  { label: "Portable Office in West Delhi", href: "/portable-office-cabins-in-west-delhi" },
  { label: "Portable Office in Greater Noida", href: "/portable-office-cabins-in-greater-noida" },
  { label: "Container Office Design", href: "/container-office-design" },
  { label: "Container Office Price", href: "/container-offices-price" },
  { label: "Container Cafe in North Delhi", href: "/container-cafes-in-north-delhi" },
  { label: "Labour Colony in Gurgaon", href: "/labour-colonies-in-gurgaon" },
  { label: "Prefab Container Homes", href: "/product/container-houses/prefab-container-homes" },
  { label: "Container House in Tamil Nadu", href: "/container-house-price-in-tamil-nadu" },
  { label: "Luxury Container Houses", href: "/product/container-houses/luxury-container-houses" },
  { label: "Industrial Sheds in Bangalore", href: "/industrial-sheds-in-bangalore" },
  { label: "PEB Construction India", href: "/product-category/peb-constructions" },
  { label: "Pre-Engineered Buildings", href: "/product-category/pre-engineered-buildings" },
  { label: "Industrial Sheds Range", href: "/product-category/industrial-sheds" },
  { label: "Prefab Houses in Bangalore", href: "/prefabricated-houses-in-bangalore" },
  { label: "Top Quality Prefab Cabins Delhi", href: "/top-quality-prefab-cabins-delhi" },
  { label: "Best Portable Cabins in India", href: "/best-portable-cabins-in-india" },
  { label: "Portable Toilets in Bangalore", href: "/portable-toilets-in-bangalore" },
  { label: "Portable Toilet Cabin", href: "/product/portable-toilet/portable-toilet-cabin" },
  { label: "Prefabricated Security Cabin", href: "/product/security-cabins/prefabricated-security-cabin" },
  { label: "Readymade Security Cabin", href: "/product/security-cabins/readymade-security-cabin" },
];

const PRODUCT_CATEGORIES = [
  { label: "Porta Cabin", href: "/product/porta-cabins" },
  { label: "Portable Cabin", href: "/product/portable-cabin" },
  { label: "Portable Office Cabin", href: "/product/portable-office" },
  { label: "Container Office", href: "/product/container-offices" },
  { label: "Container Cafe", href: "/product/container-cafe" },
  { label: "Labour Colony", href: "/product/labor-colony" },
  { label: "Container House", href: "/product/container-houses" },
  { label: "Security Cabin", href: "/product/security-cabins" },
  { label: "Portable Toilet", href: "/product/portable-toilet" },
  { label: "Industrial Shed", href: "/product/industrial-sheds" },
  { label: "PEB Construction", href: "/product/peb-constructions" },
  { label: "Pre-Engineered Building", href: "/product/pre-engineered-buildings" },
  { label: "Prefab Building", href: "/product/prefab-buildings" },
  { label: "Prefabricated House", href: "/product/prefabricated-houses" },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white relative z-20 pb-16 lg:pb-0">
      {/* Footer Money Keyword Strip */}
      <div className="border-b border-zinc-900/50 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-white font-semibold text-xl">
            Popular Portable Cabin Resources
          </h2>
          <p className="text-zinc-200 text-sm mt-2 max-w-2xl leading-relaxed">
            Explore our most searched portable cabin, container office, prefab building and industrial shed resources.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {MONEY_STRIP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block px-3.5 py-1.5 text-sm font-medium text-zinc-200 bg-zinc-900/50 hover:bg-zinc-900/90 border border-gray-700 hover:border-primary hover:text-green-300 hover:shadow-[0_0_8px_rgba(34,197,94,0.15)] rounded-full transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content - 5 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.6fr_1.2fr_2.2fr_3fr_3fr] gap-6 items-start">
          
          {/* Column 1: Company Information */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-5">
              <div className="flex items-center space-x-2 mb-4">
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
            <p className="text-zinc-200 text-sm font-medium leading-7 mb-5 mt-4">
              Saman Portable offers durable, modular, and maintenance-free buildings, designed with high-quality materials for reliability and long-term performance.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-6 items-center">
              <a 
                href="https://www.facebook.com/p/SAMAN-Portable-Office-Solutions-is-leading-manufacturer-of-Porta-Cabins-100067811252556/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-blue-500 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a 
                href="https://x.com/Saman_Portable" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-blue-400 transition-colors"
                aria-label="Visit our Twitter/X page"
              >
                <Twitter className="w-3 h-3" />
              </a>
              <a 
                href="https://www.instagram.com/pos_containerhomes/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-pink-400 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="w-3 h-3" />
              </a>
              <a 
                href="https://in.pinterest.com/samanportablecabins/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center hover:border-white hover:border-red-600 transition-colors"
                aria-label="Visit our Pinterest page"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.017 12.017.017z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg whitespace-nowrap tracking-wide mb-5">Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/rental-services" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  Rental Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium block py-0.5">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg whitespace-nowrap tracking-wide mb-5">Product Categories</h3>
            <ul className="space-y-1.5">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    prefetch={false}
                    className="text-zinc-300 hover:text-primary transition-colors duration-300 text-sm font-medium whitespace-nowrap block py-0.5"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Manufacturing Unit - 1 */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg whitespace-nowrap tracking-wide mb-5">Manufacturing Unit - 1</h3>
            <div className="bg-zinc-950/40 rounded-xl p-5 space-y-3.5 min-w-0 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <p className="text-zinc-200 text-sm leading-relaxed break-words">
                  I, Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099
                </p>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+918861622859" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  +91 88616 22859
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+918088685440" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  +91 80886 85440
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <a href="mailto:sales@samanportable.com" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  sales@samanportable.com
                </a>
              </div>
              <div className="pt-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=SAMAN+POS+India+Private+Limited+Gopasandra+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white text-[10px] px-3.5 py-2.5 rounded-lg transition-all duration-300 font-medium group animate-none"
                >
                  <Navigation className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 5: Manufacturing Unit - 2 */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg whitespace-nowrap tracking-wide mb-5">Manufacturing Unit - 2</h3>
            <div className="bg-zinc-950/40 rounded-xl p-5 space-y-3.5 min-w-0 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <p className="text-zinc-200 text-sm leading-relaxed break-words">
                  Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308
                </p>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+918796039938" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  +91 8796039938
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <a href="tel:+919708989937" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  +91 9708989937
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <a href="mailto:ncr@samanportable.com" className="text-zinc-200 text-sm font-medium whitespace-nowrap hover:text-green-300 transition-colors duration-200">
                  ncr@samanportable.com
                </a>
              </div>
              <div className="pt-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=SAMAN+POS+India+Private+Limited+Jalpura+Greater+Noida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white text-[10px] px-3.5 py-2.5 rounded-lg transition-all duration-300 font-medium group animate-none"
                >
                  <Navigation className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Policies */}
      <div className="border-t border-gray-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-xs">
              © {new Date().getFullYear()} SAMAN POS India Private Limited. All rights reserved.
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

