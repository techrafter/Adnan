'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { ProductCard } from './ProductCard';
import { STORE_LOCATION } from '@/lib/mockData';
import { SlidersHorizontal, ArrowUpDown, ArrowRight, ChevronRight, Layers } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  selectedCategory?: string;
  searchQuery?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products = [], 
  categories = [], 
  selectedCategory = 'all', 
  searchQuery = '' 
}) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'discount'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Group products by category
  const groupedCategories = useMemo(() => {
    // Filter products by search and stock first
    const filtered = products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !inStockOnly || p.inStock;
      return matchesSearch && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return 0;
    });

    if (categories.length === 0) {
      // Fallback: group by raw category strings in product list
      const map: { [catSlug: string]: { name: string; slug: string; id: string; items: Product[] } } = {};
      filtered.forEach((p) => {
        const catKey = p.category || 'other';
        if (!map[catKey]) {
          map[catKey] = {
            id: catKey,
            slug: catKey,
            name: catKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            items: []
          };
        }
        map[catKey].items.push(p);
      });
      return Object.values(map);
    }

    // Map according to Firebase categories (Always render all categories on the Index Page so none disappear)
    return categories
      .map((cat) => {
        const catProducts = filtered.filter((p) => 
          p.category === cat.slug || p.category === cat.id || p.category === cat.name
        );
        return {
          id: cat.id,
          slug: cat.slug || cat.id || cat.name,
          name: cat.name,
          icon: cat.icon,
          items: catProducts
        };
      })
      .filter((catGroup) => catGroup.items.length > 0);
  }, [products, categories, searchQuery, sortBy, inStockOnly]);

  const handleViewAllCategory = (catTarget: string) => {
    const targetUrl = `/browse?category=${encodeURIComponent(catTarget)}`;
    if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }
  };

  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4">
          <div className="h-6 bg-slate-200/70 rounded-full w-48 animate-pulse"></div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 lg:gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse border border-slate-200/50"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 py-4 sm:py-6">
      
      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 capitalize">
            {selectedCategory === 'all' ? 'Featured Categories' : selectedCategory.replace('-', ' ')}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Freshly listed items & deals in {STORE_LOCATION}
          </p>
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

      {/* Category Sections: 1 Line with 7 Items each */}
      {groupedCategories.length > 0 ? (
        <div className="space-y-8 sm:space-y-12">
          {groupedCategories.map((group) => {
            const lineAds = group.items.slice(0, 7);
            const targetSlug = group.slug || group.id || group.name;

            return (
              <div 
                key={group.id} 
                id={`category-section-${group.slug || group.id}`}
                className="scroll-mt-24 pt-2 border-b border-slate-100 pb-6 sm:pb-8 last:border-0"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-brand-500 rounded-full"></span>
                    <h4 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {group.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {group.items.length} items
                    </span>
                  </div>

                  {/* View All button */}
                  <button
                    type="button"
                    onClick={() => handleViewAllCategory(targetSlug)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline bg-brand-50 px-3 py-1.5 rounded-full transition-colors border border-brand-200/60 shrink-0 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1 Line Row displaying items (3 on mobile, 4 on tablet, 7 on PC) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 lg:gap-3">
                  {lineAds.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Bottom link if more products exist */}
                {group.items.length > 7 && (
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleViewAllCategory(targetSlug)}
                      className="text-xs font-semibold text-slate-500 hover:text-brand-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore {group.items.length - 7} more products from {group.name}...</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
