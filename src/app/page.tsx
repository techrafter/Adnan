'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { DeliveryThreshold } from '@/components/storefront/DeliveryThreshold';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { WhyUsSection } from '@/components/storefront/WhyUsSection';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { QuickSearchModal } from '@/components/storefront/QuickSearchModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { Footer } from '@/components/layout/Footer';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mockData';
import { Category, Product } from '@/types';

import { subscribeToCategories, subscribeToProducts } from '@/lib/storeService';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Sync state with Firestore database real-time listeners and LocalStorage
  useEffect(() => {
    const unsubCat = subscribeToCategories((items) => {
      if (items && items.length > 0) setCategories(items);
    });
    const unsubProd = subscribeToProducts((items) => {
      if (items && items.length > 0) setProducts(items);
    });

    try {
      const savedCategories = localStorage.getItem('adnan_categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
      const savedProducts = localStorage.getItem('adnan_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (e) {
      console.warn('Failed to load saved catalog state:', e);
    }

    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 pb-16 sm:pb-0">
      
      <div>
        {/* Main Sticky Header */}
        <Header onOpenSearch={() => setIsSearchModalOpen(true)} />

        {/* Top Category Navigation Pill Bar */}
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Centered Delivery threshold bar (Rs. X away from checkout) */}
        <DeliveryThreshold />

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
