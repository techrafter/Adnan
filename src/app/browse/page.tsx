'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  // Sync state whenever URL query parameter changes
  useEffect(() => {
    setSelectedCategory(categorySlugParam);
  }, [categorySlugParam]);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Handler to select category and push URL update so URL bar displays ?category=slug
  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    const params = new URLSearchParams();
    if (catSlug && catSlug !== 'all') {
      params.set('category', catSlug);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    const queryString = params.toString();
    router.push(`/browse${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Find active category details matching slug, id, or name
  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    const target = selectedCategory.toLowerCase();
    return categories.find((c) => {
      const cSlug = (c.slug || '').toLowerCase();
      const cId = (c.id || '').toLowerCase();
      const cName = (c.name || '').toLowerCase();
      const cNameSlug = cName.replace(/\s+/g, '-');
      return cSlug === target || cId === target || cName === target || cNameSlug === target;
    });
  }, [categories, selectedCategory]);

  const activeCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return 'All Categories & Products';
    if (activeCategoryObj) return activeCategoryObj.name;
    return selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }, [selectedCategory, activeCategoryObj]);

  // Filter products for this specific category
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory === 'all') {
          const matchesSearch =
            !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStock = !inStockOnly || product.inStock;
          return matchesSearch && matchesStock;
        }

        const prodCat = (product.category || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();

        // 1. Direct match with selectedCategory string or slugified/deslugified formats
        let matchesCategory =
          prodCat === selCat ||
          prodCat.replace(/\s+/g, '-') === selCat ||
          prodCat.replace(/-/g, ' ') === selCat.replace(/-/g, ' ');

        // 2. Match via activeCategoryObj if resolved
        if (!matchesCategory && activeCategoryObj) {
          const catId = (activeCategoryObj.id || '').toLowerCase();
          const catSlug = (activeCategoryObj.slug || '').toLowerCase();
          const catName = (activeCategoryObj.name || '').toLowerCase();
          const catNameSlug = catName.replace(/\s+/g, '-');

          matchesCategory =
            prodCat === catId ||
            prodCat === catSlug ||
            prodCat === catName ||
            prodCat === catNameSlug ||
            prodCat.replace(/-/g, ' ') === catName ||
            prodCat.replace(/\s+/g, '-') === catSlug;
        }

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

        {/* Compact Category Selection Buttons Bar */}
        <div className="bg-white border-b border-slate-200 shadow-2xs py-2 sm:py-3 px-2.5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2.5">
              <Link
                href="/"
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <h2 className="text-xs sm:text-base font-extrabold text-slate-900 tracking-tight">
                Store Categories
              </h2>
            </div>

            {/* Compact Category Pill Buttons - Scrollable on Mobile */}
            <div className="flex overflow-x-auto sm:flex-wrap items-center gap-1.5 sm:gap-2 pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => handleSelectCategory('all')}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all border cursor-pointer shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                All Categories
              </button>

              {categories.map((cat) => {
                const catValue = cat.slug || cat.id || cat.name.toLowerCase().replace(/\s+/g, '-');
                const isSelected =
                  selectedCategory.toLowerCase() === catValue.toLowerCase() ||
                  selectedCategory === cat.id ||
                  selectedCategory === cat.slug ||
                  (activeCategoryObj && activeCategoryObj.id === cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(catValue)}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs scale-102'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search products...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-[11px] sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand-600 rounded"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 text-[11px] sm:text-xs">
                <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer text-[11px] sm:text-xs"
                >
                  <option value="featured">Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Category Title & Count Header */}
          <div className="flex items-center justify-between mb-2.5 sm:mb-4">
            <h3 className="text-xs sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <span>Showing: <span className="text-brand-600">{activeCategoryName}</span></span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </h3>
          </div>

          {/* Products Display Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2.5 lg:gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-8 border border-slate-200 shadow-2xs">
              <div className="w-14 h-14 bg-emerald-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Is Category Mein Abhi Koi Products Nahi Hain</h3>
              <p className="text-xs text-slate-500 mb-4">
                Aap doosri categories check kar sakte hain ya Admin panel se naye products add kar sakte hain.
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
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading Products...
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
