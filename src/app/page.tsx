'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { WhyUsSection } from '@/components/storefront/WhyUsSection';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { QuickSearchModal } from '@/components/storefront/QuickSearchModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { Footer } from '@/components/layout/Footer';
import { useCatalog } from '@/context/CatalogContext';

export default function HomePage() {
  const { categories, products } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 pb-16 sm:pb-0">
      
      <div>
        {/* Main Sticky Header */}
        <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

        {/* Hero Promo Banner Slider (Bazaar Select) */}
        <HeroBanner />

        {/* Categories Grid with CMS Uploaded Thumbnails */}
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Product Catalog Grid with Stock Badges & Add buttons */}
        <ProductGrid
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />

        {/* Why Adnan Super Store is Razzar's Best Grocery App (3 Feature Cards) */}
        <WhyUsSection />
      </div>

      {/* Persistent Cart Drawer */}
      <CartDrawer />

      {/* App Mobile Bottom Navigation Bar (Fixed Bottom Dock) */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Quick Search Auto-Suggest Modal */}
      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Auth Modal Triggered from Bottom Nav */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
