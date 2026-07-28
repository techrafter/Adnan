'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Product, Banner, SiteSettings } from '@/types';
import {
  subscribeToCategories,
  subscribeToProducts,
  subscribeToBanners,
  subscribeToSiteSettings,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  saveSiteSettingsToFirestore,
  DEFAULT_SITE_SETTINGS
} from '@/lib/storeService';

interface CatalogContextType {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt'>) => Promise<void>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const LOCAL_STORAGE_CAT_KEY = 'adnan_categories_cache_v2';
const LOCAL_STORAGE_PROD_KEY = 'adnan_products_cache_v2';
const LOCAL_STORAGE_BANNER_KEY = 'adnan_banners_cache_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'adnan_site_settings_cache_v2';

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_CAT_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_PROD_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_BANNER_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
        if (cached) {
          return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
        }
      } catch (e) {}
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from local cache instantly on mount
  useEffect(() => {
    try {
      const cachedCat = localStorage.getItem(LOCAL_STORAGE_CAT_KEY);
      if (cachedCat) {
        const parsed = JSON.parse(cachedCat);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }
      const cachedProd = localStorage.getItem(LOCAL_STORAGE_PROD_KEY);
      if (cachedProd) {
        const parsed = JSON.parse(cachedProd);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }
      const cachedBanner = localStorage.getItem(LOCAL_STORAGE_BANNER_KEY);
      if (cachedBanner) {
        const parsed = JSON.parse(cachedBanner);
        if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
      }
      const cachedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings);
        setSiteSettings((prev) => ({ ...prev, ...parsed }));
      }
      setIsLoading(false);
    } catch (e) {
      console.warn('Failed to parse catalog cache:', e);
    }
  }, []);

  // Single Realtime Listener for entire application lifetime
  useEffect(() => {
    const unsubCat = subscribeToCategories((items) => {
      setCategories(items || []);
      setIsLoading(false);
      try {
        localStorage.setItem(LOCAL_STORAGE_CAT_KEY, JSON.stringify(items || []));
      } catch (e) {}
    });

    const unsubProd = subscribeToProducts((items) => {
      setProducts(items || []);
      setIsLoading(false);
      try {
        localStorage.setItem(LOCAL_STORAGE_PROD_KEY, JSON.stringify(items || []));
      } catch (e) {}
    });

    const unsubBanner = subscribeToBanners((items) => {
      setBanners(items || []);
      setIsLoading(false);
      try {
        localStorage.setItem(LOCAL_STORAGE_BANNER_KEY, JSON.stringify(items || []));
      } catch (e) {}
    });

    const unsubSettings = subscribeToSiteSettings((settings) => {
      if (settings) {
        setSiteSettings(settings);
        try {
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {}
      }
    });

    return () => {
      unsubCat();
      unsubProd();
      unsubBanner();
      unsubSettings();
    };
  }, []);

  // Category Actions
  const addCategory = async (newCat: Omit<Category, 'id'>) => {
    const category: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    // Optimistic local update
    const updated = [...categories, category];
    setCategories(updated);
    try { localStorage.setItem(LOCAL_STORAGE_CAT_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveCategoryToFirestore(category);
  };

  const updateCategory = async (updatedCat: Category) => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? updatedCat : c));
    setCategories(updated);
    try { localStorage.setItem(LOCAL_STORAGE_CAT_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveCategoryToFirestore(updatedCat);
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    try { localStorage.setItem(LOCAL_STORAGE_CAT_KEY, JSON.stringify(updated)); } catch (e) {}
    await deleteCategoryFromFirestore(id);
  };

  // Product / Ad Actions
  const addProduct = async (newP: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newP,
      id: `p-${Date.now()}`
    };
    const updated = [product, ...products];
    setProducts(updated);
    try { localStorage.setItem(LOCAL_STORAGE_PROD_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveProductToFirestore(product);
  };

  const updateProduct = async (updatedP: Product) => {
    const updated = products.map((p) => (p.id === updatedP.id ? updatedP : p));
    setProducts(updated);
    try { localStorage.setItem(LOCAL_STORAGE_PROD_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveProductToFirestore(updatedP);
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try { localStorage.setItem(LOCAL_STORAGE_PROD_KEY, JSON.stringify(updated)); } catch (e) {}
    await deleteProductFromFirestore(id);
  };

  // Banner Actions
  const addBanner = async (newB: Omit<Banner, 'id' | 'createdAt'>) => {
    const banner: Banner = {
      ...newB,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [banner, ...banners];
    setBanners(updated);
    try { localStorage.setItem(LOCAL_STORAGE_BANNER_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveBannerToFirestore(banner);
  };

  const updateBanner = async (updatedB: Banner) => {
    const updated = banners.map((b) => (b.id === updatedB.id ? updatedB : b));
    setBanners(updated);
    try { localStorage.setItem(LOCAL_STORAGE_BANNER_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveBannerToFirestore(updatedB);
  };

  const deleteBanner = async (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    try { localStorage.setItem(LOCAL_STORAGE_BANNER_KEY, JSON.stringify(updated)); } catch (e) {}
    await deleteBannerFromFirestore(id);
  };

  // Site Settings Action
  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);
    try { localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated)); } catch (e) {}
    await saveSiteSettingsToFirestore(updated);
  };

  return (
    <CatalogContext.Provider
      value={{
        categories,
        products,
        banners,
        siteSettings,
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSiteSettings
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
