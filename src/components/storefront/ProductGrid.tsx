'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { STORE_LOCATION } from '@/lib/mockData';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, selectedCategory, searchQuery }) => {
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'discount'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = !inStockOnly || product.inStock;
        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 capitalize">
            {selectedCategory === 'all' ? 'All Essentials & Grocery' : selectedCategory.replace('-', ' ')}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">Showing {filteredProducts.length} items available for {STORE_LOCATION} delivery</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Stock Filter Toggle */}
          <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-brand-600 rounded"
            />
            <span>In Stock</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-[11px] sm:text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display (Compact 2-Column App Grid on Mobile) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 text-center max-w-md mx-auto my-6 border border-slate-200">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">No products found</h4>
          <p className="text-xs text-slate-500 mb-3">Try searching for another keyword or selecting a different category.</p>
        </div>
      )}

    </section>
  );
};
