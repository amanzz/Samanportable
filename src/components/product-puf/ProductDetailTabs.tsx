import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Info, Truck, MessageSquare, Bookmark, Heart, Share2 } from 'lucide-react';
import ProductReviews from '@/components/ProductReviews';
import type { ProductReview } from '@/config/api';

interface ProductDetailTabsProps {
  productTitle: string;
  descriptionContent: React.ReactNode;
  specificationsContent: React.ReactNode;
  shippingContent: React.ReactNode;
  reviews?: ProductReview[];
  averageRating?: string;
  ratingCount?: number;
  productId: number;
  /** Real WooCommerce product id for review submission, when it differs from the
   *  display `productId` (merchant-feed g:id). Falls back to `productId` when absent. */
  reviewProductId?: number;
  productName?: string;
  /** Default true. Set false when the product has no real WooCommerce product
   *  mapped yet (e.g. C16-P2 EPS panel): the zero-state review list still renders,
   *  but the submission form is hidden so it never posts to a non-existent product. */
  showSubmissionForm?: boolean;
}

const TAB_TRIGGER_CLASS =
  'flex items-center gap-3 px-6 py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 font-semibold rounded-none border-r border-green-200 transition-all duration-200';

// Green hero card + tab-bar styling ported from src/components/ProductTabs.tsx (the live
// /product/[category]/[slug] template) per Addendum 7 FIX 4 — visual parity only. The actual
// Tabs wiring stays this component's own: all four TabsContent panels keep forceMount +
// data-[state=inactive]:hidden (Addendum 6's requirement, applied to all 4 tabs here vs. the
// live template's Reviews-only forceMount) — do not regress that when porting the styling.
const ProductDetailTabs = ({
  productTitle,
  descriptionContent,
  specificationsContent,
  shippingContent,
  reviews = [],
  averageRating,
  ratingCount,
  productId,
  reviewProductId,
  productName,
  showSubmissionForm = true,
}: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
        <div className="relative p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-foreground lg:text-3xl">
                    Product Details
                  </h2>
                  <p className="text-muted-foreground">Comprehensive information about {productTitle}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`transition-all duration-200 ${isBookmarked ? 'border-green-500 bg-green-500 text-white' : 'border-green-200 hover:bg-green-50'}`}
              >
                <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`transition-all duration-200 ${isLiked ? 'border-red-500 bg-red-500 text-white' : 'border-red-200 hover:bg-red-50'}`}
              >
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-0 shadow-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-0 rounded-none bg-transparent p-0 sm:grid-cols-4">
              <TabsTrigger value="description" className={TAB_TRIGGER_CLASS}>
                <FileText className="h-4 w-4" aria-hidden="true" />
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className={TAB_TRIGGER_CLASS}>
                <Info className="h-4 w-4" aria-hidden="true" />
                Specifications
              </TabsTrigger>
              <TabsTrigger value="shipping" className={`${TAB_TRIGGER_CLASS} sm:border-r`}>
                <Truck className="h-4 w-4" aria-hidden="true" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-3 rounded-none px-6 py-4 font-semibold transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" forceMount className="m-0 p-4 data-[state=inactive]:hidden sm:p-6 md:p-8">
            {descriptionContent}
          </TabsContent>

          <TabsContent value="specifications" forceMount className="m-0 p-4 data-[state=inactive]:hidden sm:p-6 md:p-8">
            {specificationsContent}
          </TabsContent>

          <TabsContent value="shipping" forceMount className="m-0 p-4 data-[state=inactive]:hidden sm:p-6 md:p-8">
            {shippingContent}
          </TabsContent>

          <TabsContent value="reviews" forceMount className="m-0 p-4 data-[state=inactive]:hidden sm:p-6 md:p-8">
            <ProductReviews
              reviews={reviews}
              averageRating={averageRating}
              ratingCount={ratingCount}
              productId={productId}
              reviewProductId={reviewProductId}
              productName={productName}
              showSubmissionForm={showSubmissionForm}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductDetailTabs;
