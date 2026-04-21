import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Info, 
  Truck, 
  Package, 
  Shield, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Star,
  CheckCircle,
  Award,
  Zap,
  Users,
  Globe,
  ArrowRight,
  ExternalLink,
  Download,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react';
import OptimizedContent from './OptimizedContent';
import { replaceInternalLinks } from '../utils/imageReplacement';
import { getDefaultFAQs } from '../utils/faqUtils';


interface ProductTabsProps {
  description: string;
  productTitle: string;
}

// FAQ Component with beautiful accordion design
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void }> = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex items-center justify-between bg-gradient-to-r from-white to-gray-50 hover:from-primary/5 hover:to-blue-50 transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-blue-50"
      >
        <span className="font-semibold text-gray-900 pr-4 text-left group-hover:text-primary transition-colors duration-200">{question}</span>
        <div className="flex-shrink-0">
        {isOpen ? (
            <ChevronUp className="w-5 h-5 text-primary transition-transform duration-200" />
        ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-primary transition-all duration-200" />
        )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50/50 to-white border-t border-gray-100">
          <div 
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_p]:mb-3 [&_p]:last:mb-0 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

// FAQ Section Component
interface FAQSectionProps {
  productTitle?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

const FAQSection: React.FC<FAQSectionProps> = ({ productTitle, faqs }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const defaultFAQs = getDefaultFAQs(productTitle || 'product');

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {(faqs && faqs.length > 0 ? faqs : defaultFAQs).map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFAQ === index}
            onToggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
        </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-green-900 mb-2">Quality Guarantee</h4>
            <p className="text-green-800 leading-relaxed">
          All our portable cabins come with quality assurance and are manufactured using premium materials with rigorous quality checks.
        </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Premium Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Quality Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Warranty Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductTabs: React.FC<ProductTabsProps> = ({ description, productTitle }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Simplified approach: Use description directly without any processing
  const cleanDescription = description;

  // Remove key features extraction to prevent duplication
  // The description will be displayed only once in the main content area

  // SEO-optimized additional information content
  const additionalInfo = `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground mb-3">Product Specifications</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50 p-4 rounded-lg">
          <h4 class="font-medium text-foreground mb-2">Construction Details</h4>
          <ul class="text-sm text-muted-foreground space-y-1">
            <li>• High-grade steel frame construction</li>
            <li>• Weather-resistant exterior coating</li>
            <li>• Insulated walls and ceiling</li>
            <li>• Anti-corrosion treatment</li>
          </ul>
        </div>
        <div class="bg-slate-50 p-4 rounded-lg">
          <h4 class="font-medium text-foreground mb-2">Features & Benefits</h4>
          <ul class="text-sm text-muted-foreground space-y-1">
            <li>• Quick installation and setup</li>
            <li>• Portable and relocatable</li>
            <li>• Energy-efficient design</li>
            <li>• Customizable interior layout</li>
          </ul>
        </div>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-2">Quality Assurance</h4>
        <p class="text-sm text-blue-800">All our portable cabins are manufactured using premium materials and undergo rigorous quality checks to ensure durability and safety standards.</p>
      </div>
    </div>
  `;

  // SEO-optimized shipping information content
  // Shipping information component
  const ShippingInfoContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-green-900">Delivery Information</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">Free delivery within 50km radius</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">Professional installation service available</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">Delivery time: 7-14 working days</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">GPS tracking for shipment</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-blue-900">Packaging & Handling</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Secure packaging for safe transport</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Pre-assembled components</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Weather-protected shipping</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Damage-free guarantee</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0A3D2A] to-emerald-600 rounded-xl flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-green-900">Warranty & Support</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 p-4 rounded-xl">
            <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Warranty Coverage
            </h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">2-year structural warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">1-year electrical components</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">6-month paint and finish</span>
              </div>
            </div>
          </div>
          <div className="bg-white/70 p-4 rounded-xl">
            <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              After-Sales Support
            </h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">On-site maintenance service</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">Spare parts availability</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-purple-900">Installation Timeline</h4>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <span className="font-semibold text-purple-800">Site Preparation</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              1-2 days
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <span className="font-semibold text-purple-800">Delivery & Setup</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              1 day
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <span className="font-semibold text-purple-800">Final Inspection</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Same day
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modern Product Description Section */}
      <div className="space-y-6">
        {/* Hero Section with Green Theme */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 border-0 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Product Details
                    </h2>
                    <p className="text-muted-foreground">Comprehensive information about {productTitle}</p>
                  </div>
                </div>
                
                {/* Key Features Preview removed to prevent duplication */}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`transition-all duration-200 ${isBookmarked ? 'bg-green-500 text-white border-green-500' : 'hover:bg-green-50 border-green-200'}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`transition-all duration-200 ${isLiked ? 'bg-red-500 text-white border-red-500' : 'hover:bg-red-50 border-red-200'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-green-50 border-green-200">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Modern Tabs Design with Green Theme */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 h-auto p-0">
                <TabsTrigger 
                  value="description" 
                  className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none border-r border-green-200 transition-all duration-200"
                >
                  <FileText className="w-5 h-5" />
                  <span className="hidden sm:inline">Description</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none border-r border-green-200 transition-all duration-200"
                >
                  <Info className="w-5 h-5" />
                  <span className="hidden sm:inline">Specifications</span>
                  <span className="sm:hidden">Specs</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="shipping" 
                  className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none border-r border-green-200 transition-all duration-200"
                >
                  <Truck className="w-5 h-5" />
                  <span className="hidden sm:inline">Shipping</span>
                  <span className="sm:hidden">Ship</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none transition-all duration-200"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">FAQs</span>
                  <span className="sm:hidden">FAQ</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-0">
              <TabsContent value="description" className="mt-0 p-4 sm:p-6 md:p-8">
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Description Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Product Overview</h3>
                      <p className="text-muted-foreground">Detailed information about {productTitle}</p>
              </div>
            </div>

                  {/* Description Content with Green Theme */}
                  <div className="transition-all duration-300">
                    <OptimizedContent 
                      content={cleanDescription || '<p class="text-center text-muted-foreground py-12">No description available for this product.</p>'}
                      className="prose prose-lg max-w-none leading-relaxed overflow-x-hidden product-description-content"
                    />
                  </div>

                  {/* Key Features section removed to prevent duplication with main description */}


          </div>
        </TabsContent>

              <TabsContent value="additional" className="mt-0 p-4 sm:p-6 md:p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                      <h3 className="text-2xl font-bold text-foreground">Technical Specifications</h3>
                      <p className="text-muted-foreground">Detailed technical information and features</p>
              </div>
            </div>
            <OptimizedContent 
              content={additionalInfo}
              className="prose prose-lg max-w-none"
            />
          </div>
        </TabsContent>

                <TabsContent value="shipping" className="mt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                      <h3 className="text-2xl font-bold text-foreground">Shipping & Delivery</h3>
                      <p className="text-muted-foreground">Delivery information and warranty details</p>
              </div>
            </div>
                  <div className="prose prose-lg max-w-none">
              <ShippingInfoContent />
            </div>
          </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                      <h3 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h3>
                      <p className="text-muted-foreground">Find answers to common questions about {productTitle}</p>
              </div>
            </div>
                  <div className="prose prose-lg max-w-none">
              <FAQSection productTitle={productTitle} />
            </div>
          </div>
            </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default ProductTabs;