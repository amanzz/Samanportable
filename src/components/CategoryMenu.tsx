import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const CategoryMenu = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Main categories to display prominently
  const mainCategories = [
    { name: 'Portable Cabin', slug: 'portable-cabin', href: '/product-category/portable-cabin' },
    { name: 'Container Offices', slug: 'container-offices', href: '/product-category/container-offices' },
    { name: 'Porta Cabins', slug: 'porta-cabins', href: '/product-category/porta-cabins' },
    { name: 'Labor Colony', slug: 'labor-colony', href: '/product-category/labor-colony' },
    { name: 'Portable Office', slug: 'portable-office', href: '/product-category/portable-office' },
    { name: 'Container Cafe', slug: 'container-cafe', href: '/product-category/container-cafe' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();

    // Cleanup function
    return () => {
      setCategories([]);
      setIsLoading(true);
    };
  }, []);

  const handleCategoryClick = async (slug: string) => {
    setIsDropdownOpen(false);
    try {
      await router.push(
        `/product-category/${slug}`,
        undefined,
        { scroll: true, shallow: false }
      );
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto container-padding">
        <nav className="flex items-center space-x-6 py-4 overflow-x-auto scrollbar-hide">
          {/* Categories Dropdown Button */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white border-[#0A3D2A] hover:border-[#0A3D2A]/90 flex items-center space-x-2 px-4 py-2 rounded-md"
              >
                <Menu className="w-4 h-4" />
                <span>CATEGORIES</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white text-gray-900 shadow-lg rounded-md mt-2 z-50 p-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-2 text-gray-600">Loading categories...</div>
              ) : (
                <>
                  <div className="px-3 py-2 border-b mb-2">
                    <h3 className="font-semibold text-[#0A3D2A] text-sm uppercase tracking-wide">
                      All Product Categories
                    </h3>
                  </div>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} className="cursor-pointer p-0">
                      <button
                        onClick={() => handleCategoryClick(category.slug)}
                        className="flex items-center justify-between px-3 py-2 hover:bg-[#0A3D2A] hover:text-white w-full text-left transition-colors rounded-md"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-400 group-hover:text-white">
                          ({category.count})
                        </span>
                      </button>
                    </DropdownMenuItem>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <button
                      onClick={() => router.push('/product')}
                      className="flex items-center px-3 py-2 hover:bg-[#0A3D2A] hover:text-white w-full text-left transition-colors rounded-md font-medium"
                    >
                      View All Products
                    </button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Main Category Links */}
          {mainCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="text-white hover:text-gray-300 font-medium transition-colors whitespace-nowrap text-sm"
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryMenu;
