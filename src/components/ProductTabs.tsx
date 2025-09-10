import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Info, Truck, Package, Shield, Clock } from 'lucide-react';
import LongformContent from './LongformContent';

interface ProductTabsProps {
  description: string;
  productTitle: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, productTitle }) => {
  const [activeTab, setActiveTab] = useState('description');

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
          <div className="space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Product Description</h3>
                <p className="text-sm text-muted-foreground">Detailed information about {productTitle}</p>
              </div>
            </div>
            <LongformContent 
              content={description || '<p>No description available for this product.</p>'}
              title={productTitle}
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
  );
};

export default ProductTabs;