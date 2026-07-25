'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  const { banners } = useCatalog();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter active and non-expired banners
  const activeBanners = (banners || []).filter((b) => {
    if (b.isActive === false) return false;
    if (b.isForever === false && b.expiresAt) {
      return new Date(b.expiresAt).getTime() > Date.now();
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
    <div className="relative w-full h-full">
      <Image
        src={getOptimizedImageUrl(banner.image, 1400)}
        alt={banner.title || 'Store Banner'}
        fill
        className="object-cover"
        priority
      />
    </div>
  );

  const renderBannerLink = (banner: typeof currentBanner) => {
    if (banner.targetCategory) {
      return (
        <Link
          href={`/browse?category=${encodeURIComponent(banner.targetCategory)}`}
          className="block w-full h-full cursor-pointer"
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
          className="block w-full h-full cursor-pointer"
        >
          {renderBannerMedia(banner)}
        </a>
      );
    }
    return renderBannerMedia(banner);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-3 sm:my-5">
      <div className="relative w-full aspect-[3.2/1] sm:aspect-[4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200/80">
        {/* Silky Smooth Crossfade Animation - Pure real image without buttons or overlays */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeInOut' },
              scale: { duration: 0.8, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {renderBannerLink(currentBanner)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


