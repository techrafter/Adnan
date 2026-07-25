'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { QuickSearchModal } from '@/components/storefront/QuickSearchModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { useCatalog } from '@/context/CatalogContext';
import { STORE_LOCATION } from '@/lib/mockData';
import { ArrowLeft, ArrowUpDown, Layers, Search } from 'lucide-react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const categorySlugParam = searchParams.get('category') || 'all';
  const urlSearchQuery = searchParams.get('search') || searchParams.get('q') || '';

  const { categories, products } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlugParam);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'discount'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (categorySlugParam) {
      setSelectedCategory(categorySlugParam);
    }
  }, [categorySlugParam]);

  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Find active category details
  const activeCategoryObj = useMemo(() => {
    return categories.find(
      (c) => c.slug === selectedCategory || c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [categories, selectedCategory]);

  const activeCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return 'All Categories & Ads';
    if (activeCategoryObj) return activeCategoryObj.name;
    return selectedCategory.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }, [selectedCategory, activeCategoryObj]);

  // Filter products for this specific category
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          product.category === selectedCategory ||
          (activeCategoryObj && (product.category === activeCategoryObj.id || product.category === activeCategoryObj.slug));

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
  }, [products, selectedCategory, activeCategoryObj, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 pb-16 sm:pb-0">
      <div>
        <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

        {/* Sub-header banner for Category Browse */}
        <div className="bg-white border-b border-slate-200 shadow-2xs py-4 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeCategoryName}
                </h1>
                <p className="text-xs text-slate-500">
                  Showing all live ads & products in {STORE_LOCATION} ({filteredProducts.length} items)
                </p>
              </div>
            </div>

            {/* Category Select Pill Filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Ads
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug || cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.slug || selectedCategory === cat.id
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ads in ${activeCategoryName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand-600 rounded"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-xs">
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

          {/* Ads Display Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-8 border border-slate-200 shadow-2xs">
              <div className="w-14 h-14 bg-emerald-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Is Category Mein Abhi Koi Ads Nahi Hain</h3>
              <p className="text-xs text-slate-500 mb-4">
                Aap doosri categories check kar sakte hain ya Admin panel se nayi ads add kar sakte hain.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back to Home</span>
              </Link>
            </div>
          )}
        </main>
      </div>

      {isSearchModalOpen && <QuickSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}

      <CartDrawer />
      <MobileBottomNav onOpenSearch={() => setIsSearchModalOpen(true)} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading Ads...
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
