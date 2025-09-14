import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Info, Truck, Package, Shield, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import FAQSchema from './FAQSchema';


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
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors duration-200"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div 
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
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
  
  // Default FAQs for portable offices/cabins
  const defaultFAQs = [
    {
      question: `What is the cost of a ${productTitle}?`,
      answer: `The cost of a ${productTitle} varies based on size, materials, and customization options. Our standard models start from ₹25,000 and can go up to ₹3.5 lakhs for fully fitted units with premium features. Contact us for a detailed quote based on your specific requirements.`
    },
    {
      question: "How long does installation take?",
      answer: "Installation is fast and efficient. Once delivered, a portable office cabin can be placed on RCC blocks or strip footing in one to two days. Units arrive prefabricated from the factory, so only utility hookups and inspections remain. Even custom cabins rarely exceed one week for full setup."
    },
    {
      question: "Do I need permits for a portable cabin?",
      answer: "Permits depend on local municipal rules. In most cases, short-term use for construction sites or temporary offices may not need full building permits. For long-term placement, zoning approvals and fire compliance certificates under NBC India may be required. Always confirm with your local authority."
    },
    {
      question: "What is the expected lifespan?",
      answer: "A portable office built with mild steel, PUF panels, or ACP cladding lasts 10-20 years. Lifespan depends on material, maintenance, and usage. Regular repainting, panel inspections, and AMC servicing extend service life, ensuring the cabin remains safe and functional throughout its cycle."
    },
    {
      question: "Can portable offices include toilets and pantries?",
      answer: "Yes, modern porta cabins can be designed with toilets, washrooms, and pantries. Plumbing, water tanks, and ventilation systems are integrated at the factory. These features make the cabin more self-sufficient and are common in corporate, retail, and school applications."
    },
    {
      question: "Are portable site offices safe in heavy rain & wind?",
      answer: "Yes, our portable offices are engineered to withstand harsh weather conditions including heavy rain and strong winds. They feature reinforced steel frames, weather-resistant exterior coatings, and proper drainage systems to ensure safety and durability in all weather conditions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2">💡 Need More Information?</h4>
        <p className="text-sm text-purple-800">
          Have specific questions about {productTitle}? Our experts are here to help you choose the perfect solution for your needs.
        </p>
      </div>
      
      <div className="space-y-3">
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
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-green-900">Quality Guarantee</h4>
        </div>
        <p className="text-sm text-green-800">
          All our portable cabins come with quality assurance and are manufactured using premium materials with rigorous quality checks.
        </p>
      </div>
    </div>
  );
};

const ProductTabs: React.FC<ProductTabsProps> = ({ description, productTitle }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  // Extract FAQs from product description or use default ones
  const extractFAQsFromDescription = (description: string) => {
    try {
      // Parse Rank Math FAQ schema from WordPress content
      const faqSchemaRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      const matches = description.match(faqSchemaRegex);
      
      if (matches) {
        for (const match of matches) {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
          try {
            const schema = JSON.parse(jsonContent);
            if (schema['@type'] === 'FAQPage' && schema.mainEntity) {
              return schema.mainEntity.map((item: any) => ({
                question: item.name || item.question,
                answer: item.acceptedAnswer?.text || item.answer
              }));
            }
          } catch (e) {
            console.warn('Failed to parse FAQ schema:', e);
          }
        }
      }
      
      // Alternative: Parse HTML FAQ blocks (common WordPress FAQ plugin format)
      const faqBlockRegex = /<div[^>]*class=["'][^"']*faq[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
      const faqBlocks = description.match(faqBlockRegex);
      
      if (faqBlocks) {
        const faqs = [];
        for (const block of faqBlocks) {
          const questionMatch = block.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i) || 
                               block.match(/<[^>]*class=["'][^"']*question[^"']*["'][^>]*>([^<]+)</i);
          const answerMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || 
                             block.match(/<[^>]*class=["'][^"']*answer[^"']*["'][^>]*>([\s\S]*?)</i);
          
          if (questionMatch && answerMatch) {
            faqs.push({
              question: questionMatch[1].trim(),
              answer: answerMatch[1].replace(/<[^>]*>/g, '').trim()
            });
          }
        }
        if (faqs.length > 0) return faqs;
      }
      
      return [];
    } catch (error) {
      console.warn('Error parsing FAQs from description:', error);
      return [];
    }
  };
  
  const productFAQs = description ? extractFAQsFromDescription(description) : [];

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <Truck className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-medium text-green-900">Delivery Information</h4>
          </div>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Free delivery within 50km radius</li>
            <li>• Professional installation service available</li>
            <li>• Delivery time: 7-14 working days</li>
            <li>• GPS tracking for shipment</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <Package className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">Packaging & Handling</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Secure packaging for safe transport</li>
            <li>• Pre-assembled components</li>
            <li>• Weather-protected shipping</li>
            <li>• Damage-free guarantee</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center mb-3">
          <Shield className="w-5 h-5 text-orange-600 mr-2" />
          <h4 className="font-medium text-orange-900">Warranty & Support</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-orange-800 mb-2">Warranty Coverage</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 2-year structural warranty</li>
              <li>• 1-year electrical components</li>
              <li>• 6-month paint and finish</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-orange-800 mb-2">After-Sales Support</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 24/7 customer support</li>
              <li>• On-site maintenance service</li>
              <li>• Spare parts availability</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center mb-3">
          <Clock className="w-5 h-5 text-purple-600 mr-2" />
          <h4 className="font-medium text-purple-900">Installation Timeline</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-sm font-medium text-purple-800">Site Preparation</span>
            <span className="text-sm text-purple-600">1-2 days</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-sm font-medium text-purple-800">Delivery & Setup</span>
            <span className="text-sm text-purple-600">1 day</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-sm font-medium text-purple-800">Final Inspection</span>
            <span className="text-sm text-purple-600">Same day</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* FAQ Schema for SEO */}
      <FAQSchema 
         faqs={productFAQs} 
         productTitle={productTitle}
         url={typeof window !== 'undefined' ? window.location.href : undefined}
       />
      
      <Card className="p-6 bg-card border border-border shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="description" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Description</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger 
            value="additional" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Additional Info</span>
            <span className="sm:hidden">Details</span>
          </TabsTrigger>
          <TabsTrigger 
            value="shipping" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Shipping</span>
            <span className="sm:hidden">Ship</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Product Description</h3>
                <p className="text-sm text-muted-foreground">Detailed information about {productTitle}</p>
              </div>
            </div>
            <div 
              className="prose prose-sm max-w-none mt-6 overflow-x-hidden leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:w-full [&_img]:object-contain [&_img]:rounded-lg [&_img]:shadow-sm sm:[&_img]:max-w-md md:[&_img]:max-w-lg [&_img]:mx-auto [&_img]:block [&_img]:box-border [&_img]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:bg-white [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:shadow-sm [&_table]:border [&_table]:border-gray-200 [&_table]:mb-6 [&_table_th]:bg-green-600 [&_table_th]:text-white [&_table_th]:font-semibold [&_table_th]:px-4 [&_table_th]:py-3 [&_table_th]:text-left [&_table_th]:border-b [&_table_th]:border-green-700 [&_table_td]:px-4 [&_table_td]:py-3 [&_table_td]:border-b [&_table_td]:border-gray-200 [&_table_td]:text-gray-700 [&_table_tr:nth-child(even)]:bg-gray-50 [&_table_tr:hover]:bg-green-50 [&_table_tr]:transition-colors [&_table_tr]:duration-200 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_li]:leading-relaxed [&_p]:mb-6 [&_p]:leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-5 [&_h4]:text-base [&_h4]:font-medium [&_h4]:mb-3 [&_h4]:mt-4 [&_h5]:text-sm [&_h5]:font-medium [&_h5]:mb-2 [&_h5]:mt-3 [&_h6]:text-sm [&_h6]:font-normal [&_h6]:mb-2 [&_h6]:mt-3 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-6 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_strong]:font-semibold [&_em]:italic [&_hr]:border-gray-300 [&_hr]:my-8"
              dangerouslySetInnerHTML={{ __html: description || '<p>No description available for this product.</p>' }}
            />
          </div>
        </TabsContent>

        <TabsContent value="additional" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Additional Information</h3>
                <p className="text-sm text-muted-foreground">Technical specifications and features</p>
              </div>
            </div>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: additionalInfo }}
            />
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Shipping & Delivery</h3>
                <p className="text-sm text-muted-foreground">Delivery information and warranty details</p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <ShippingInfoContent />
            </div>
          </div>
        </TabsContent>


      </Tabs>
    </Card>
    </>
  );
};

export default ProductTabs;