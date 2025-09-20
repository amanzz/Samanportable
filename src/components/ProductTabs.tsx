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
  
  // Default FAQs for portable offices/cabins - properly ordered
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Extract FAQs from product description or use default ones
  const extractFAQsFromDescription = (description: string) => {
    try {
      // First, remove table content to avoid interference
      const descriptionWithoutTables = description.replace(/<table[\s\S]*?<\/table>/gi, '');
      
      // Try to find FAQ section with heading
      const faqSectionRegex = /(<h[1-6][^>]*>FAQ[^<]*<\/h[1-6]>[\s\S]*?)(?=<h[1-6]|$)/gi;
      const faqMatches = descriptionWithoutTables.match(faqSectionRegex);
      
      if (faqMatches) {
        const faqs = [];
        for (const section of faqMatches) {
          // Remove FAQ heading and split by question headings
          const content = section.replace(/<h[1-6][^>]*>FAQ[^<]*<\/h[1-6]>/gi, '');
          
          // Find all question headings
          const questionRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
          const questions = [];
          let match;
          
          while ((match = questionRegex.exec(content)) !== null) {
            if (!match[1].toLowerCase().includes('faq')) {
              questions.push({
                text: match[1].trim(),
                index: match.index
              });
            }
          }
          
          // Extract answers for each question
          for (let i = 0; i < questions.length; i++) {
            const currentQuestion = questions[i];
            const nextQuestion = questions[i + 1];
            
            // Get content between current question and next question (or end)
            const startIndex = currentQuestion.index + currentQuestion.text.length;
            const endIndex = nextQuestion ? nextQuestion.index : content.length;
            const answerContent = content.substring(startIndex, endIndex);
            
            // Clean the answer content
            const cleanAnswer = answerContent
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/^\s*[\r\n]+/gm, '') // Remove empty lines
              .trim();
            
            if (cleanAnswer) {
              faqs.push({
                question: currentQuestion.text,
                answer: cleanAnswer
              });
            }
          }
        }
        if (faqs.length > 0) return faqs;
      }

      // Parse Rank Math FAQ schema from WordPress content
      const faqSchemaRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      const matches = descriptionWithoutTables.match(faqSchemaRegex);
      
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
      
      // Alternative: Parse HTML FAQ blocks
      const faqBlockRegex = /<div[^>]*class=["'][^"']*faq[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
      const faqBlocks = descriptionWithoutTables.match(faqBlockRegex);
      
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
  
  // Simple approach: Don't extract FAQs, let WordPress content display as-is
  const productFAQs: Array<{ question: string; answer: string }> = [];
  const cleanDescription = description;

  // Extract key features from description
  const extractKeyFeatures = (description: string): string[] => {
    const features: string[] = [];
    const featureRegex = /(?:features?|benefits?|highlights?)[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    const matches = description.match(featureRegex);
    
    if (matches) {
      const listItems = matches[0].match(/<li[^>]*>([^<]+)<\/li>/gi);
      if (listItems) {
        listItems.forEach(item => {
          const text = item.replace(/<[^>]*>/g, '').trim();
          if (text) features.push(text);
        });
      }
    }
    
    return features.slice(0, 6); // Limit to 6 features
  };

  const keyFeatures = extractKeyFeatures(description);

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
      
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-orange-900">Warranty & Support</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 p-4 rounded-xl">
            <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Warranty Coverage
            </h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">2-year structural warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">1-year electrical components</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">6-month paint and finish</span>
              </div>
            </div>
          </div>
          <div className="bg-white/70 p-4 rounded-xl">
            <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              After-Sales Support
            </h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">On-site maintenance service</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-sm font-medium text-orange-700">Spare parts availability</span>
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
      {/* FAQ Schema for SEO */}
      <FAQSchema 
         faqs={productFAQs} 
         productTitle={productTitle}
         url={typeof window !== 'undefined' ? window.location.href : undefined}
       />
      
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
                
                {/* Key Features Preview */}
                {keyFeatures.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {keyFeatures.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white/70 rounded-lg border border-green-200/50 backdrop-blur-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 h-auto p-0">
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
                  className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none transition-all duration-200"
          >
                  <Truck className="w-5 h-5" />
            <span className="hidden sm:inline">Shipping</span>
            <span className="sm:hidden">Ship</span>
          </TabsTrigger>
        </TabsList>
            </Tabs>
              </div>

          <div className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="description" className="mt-0 p-8">
                <div className="space-y-8">
                  {/* Description Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Product Overview</h3>
                      <p className="text-muted-foreground">Detailed information about {productTitle}</p>
              </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-primary hover:text-primary/80"
                    >
                      {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                    </Button>
            </div>

                  {/* Description Content with Green Theme */}
                  <div className={`transition-all duration-300 ${isDescriptionExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
                    <div 
                      className="prose prose-lg max-w-none leading-relaxed overflow-x-hidden product-description-content"
                      dangerouslySetInnerHTML={{ __html: cleanDescription || '<p class="text-center text-muted-foreground py-12">No description available for this product.</p>' }}
                    />
                  </div>

                  {/* Key Features Section with Green Theme */}
                  {keyFeatures.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-foreground">Key Features</h4>
                          <p className="text-muted-foreground">What makes this product special</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


          </div>
        </TabsContent>

              <TabsContent value="additional" className="mt-0 p-8">
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
            <div 
                    className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: additionalInfo }}
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
      </Tabs>
          </div>
    </Card>
      </div>
    </>
  );
};

export default ProductTabs;