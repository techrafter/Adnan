'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { DeliveryThreshold } from '@/components/storefront/DeliveryThreshold';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { QuickSearchModal } from '@/components/storefront/QuickSearchModal';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      
      <div>
        {/* Main Sticky Header */}
        <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

        {/* Top Category Navigation Pill Bar */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Delivery threshold bar (Rs. X away from checkout) */}
        <DeliveryThreshold />

        {/* Hero Promo Banner Slider (Bazaar Select) */}
        <HeroBanner />

        {/* Categories Grid (Soft Light Cards) */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Product Catalog Grid with Stock Badges & Add buttons */}
        <ProductGrid
          products={MOCK_PRODUCTS}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>

      {/* Persistent Cart Drawer */}
      <CartDrawer />

      {/* Quick Search Auto-Suggest Modal */}
      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
