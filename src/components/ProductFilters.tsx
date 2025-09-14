import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Filter, X, Search } from 'lucide-react';
import { ProductFilters as ProductFiltersType, WooCommerceProduct } from '../config/api';

interface ProductFiltersProps {
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onReset: () => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  attributes,
  filters,
  onFiltersChange,
  onReset,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };



  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetFilters: ProductFiltersType = {};
    setLocalFilters(resetFilters);
    onReset();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof ProductFiltersType] !== undefined && 
    filters[key as keyof ProductFiltersType] !== ''
  ).length;

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </span>
          <span>{isOpen ? 'Hide' : 'Show'}</span>
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-card border rounded-lg p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search products..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={localFilters.category || 'all'}
              onValueChange={(value: string) => handleFilterChange('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          {/* Stock Status */}
          <div className="space-y-2">
            <Label>Stock Status</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.stock_status === 'instock'}
                  onCheckedChange={(checked: boolean) => 
                    handleFilterChange('stock_status', checked ? 'instock' : undefined)
                  }
                />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.stock_status === 'outofstock'}
                  onCheckedChange={(checked: boolean) => 
                    handleFilterChange('stock_status', checked ? 'outofstock' : undefined)
                  }
                />
                <span className="text-sm">Out of Stock</span>
              </label>
            </div>
          </div>

          {/* On Sale */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={localFilters.on_sale || false}
                onCheckedChange={(checked: boolean) => 
                  handleFilterChange('on_sale', checked || undefined)
                }
              />
              <span className="text-sm font-medium">On Sale Only</span>
            </label>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label htmlFor="sort">Sort By</Label>
            <Select
              value={`${localFilters.orderby || 'date'}-${localFilters.order || 'desc'}`}
              onValueChange={(value: string) => {
                const [orderby, order] = value.split('-');
                handleFilterChange('orderby', orderby as any);
                handleFilterChange('order', order as any);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="title-asc">Name: A to Z</SelectItem>
                <SelectItem value="title-desc">Name: Z to A</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="popularity-desc">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

