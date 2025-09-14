import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface LightweightProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string;
  on_sale: boolean;
  featured_image: string;
  category: string;
}

interface ProductShowcaseProps {
  featuredProducts: LightweightProduct[];
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ featuredProducts = [] }) => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover our premium selection of portable cabins and container offices, designed for modern businesses seeking flexible and sustainable workspace solutions.
            </p>
          </div>
          <Link href="/product">
            <Button 
              size="lg" 
              className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                priority={index < 3} // Priority loading for first 3 products
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Products Available
            </h3>
            <p className="text-muted-foreground mb-6">
              We&apos;re currently updating our product catalog. Please check back soon!
            </p>
            <Link href="/product">
              <Button 
                size="lg" 
                className="bg-[#0A3D2A] hover:bg-[#0A3D2A] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;

