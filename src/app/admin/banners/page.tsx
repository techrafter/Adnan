'use client';

import React from 'react';
import { useCatalog } from '@/context/CatalogContext';
import { BannerManager } from '@/components/admin/BannerManager';

export default function AdminBannersPage() {
  const { banners, categories, addBanner, updateBanner, deleteBanner } = useCatalog();

  return (
    <BannerManager
      banners={banners}
      categories={categories}
      onAddBanner={addBanner}
      onUpdateBanner={updateBanner}
      onDeleteBanner={deleteBanner}
    />
  );
}
