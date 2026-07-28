'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  const { banners } = useCatalog();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter active and non-expired banners
  const activeBanners = (banners || []).filter((b) => {
    if (!b || !b.image) return false;
    if (b.isActive === false) return false;
    if (b.isForever === false && b.expiresAt) {
      const expTime = new Date(b.expiresAt).getTime();
      if (!isNaN(expTime) && expTime < Date.now()) return false;
    }
    return true;
  });

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null; // Cleanly hide if no active banners
  }

  const currentBanner = activeBanners[activeSlide % activeBanners.length];

  const renderBannerMedia = (banner: typeof currentBanner) => (
    <img
      src={getOptimizedImageUrl(banner.image, 1400)}
      alt={banner.title || 'Store Banner'}
      className="w-full h-auto object-cover block"
    />
  );

  const renderBannerLink = (banner: typeof currentBanner) => {
    if (banner.targetCategory) {
      return (
        <Link
          href={`/browse?category=${encodeURIComponent(banner.targetCategory)}`}
          className="block w-full cursor-pointer"
        >
          {renderBannerMedia(banner)}
        </Link>
      );
    }
    if (banner.targetUrl) {
      return (
        <a
          href={banner.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full cursor-pointer"
        >
          {renderBannerMedia(banner)}
        </a>
      );
    }
    return renderBannerMedia(banner);
  };

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 my-0 sm:my-5">
      <div className="relative w-full rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border sm:border-slate-200/80 shadow-none sm:shadow-sm">
        {/* Silky Smooth Crossfade Animation - Direct image without grey card container */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="w-full"
          >
            {renderBannerLink(currentBanner)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
