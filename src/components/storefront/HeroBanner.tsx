'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export const HeroBanner: React.FC = () => {
  const { banners } = useCatalog();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter active and non-expired banners (robust check for isActive)
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

  const slide = activeBanners[activeSlide % activeBanners.length];

  const content = (
    <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
      <Image
        src={getOptimizedImageUrl(slide.image, 1400)}
        alt={slide.title || 'Store Banner'}
        fill
        className="object-cover"
        priority
      />

      {/* Carousel Slider Controls (Only if multiple banners exist) */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
            title="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveSlide((prev) => (prev + 1) % activeBanners.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
            title="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveSlide(index);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  index === activeSlide % activeBanners.length
                    ? 'w-6 bg-brand-500'
                    : 'w-2 bg-white/50 hover:bg-white/90'
                }`}
                title={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-3 sm:my-5">
      {slide.targetCategory ? (
        <Link href={`/browse?category=${encodeURIComponent(slide.targetCategory)}`} className="block">
          {content}
        </Link>
      ) : slide.targetUrl ? (
        <a href={slide.targetUrl} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};
