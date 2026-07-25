'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { ArrowRight, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export const HeroBanner: React.FC = () => {
  const { banners } = useCatalog();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter only active and non-expired banners from Firebase
  const activeBanners = (banners || []).filter((b) => {
    if (!b.isActive) return false;
    if (!b.isForever && b.expiresAt) {
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
    return null; // Cleanly hide if admin has no active banners uploaded yet
  }

  const slide = activeBanners[activeSlide % activeBanners.length];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl transition-all duration-700 min-h-[220px] sm:min-h-[280px] flex items-center group">
        
        {/* Full Banner Image Overlay / Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getOptimizedImageUrl(slide.image, 1200)}
            alt={slide.title || 'Promotional Banner'}
            fill
            className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 p-6 sm:p-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-brand-600/90 backdrop-blur-md text-white font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SPECIAL PROMO
            </span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Guaranteed
            </span>
          </div>

          {slide.title && (
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight uppercase text-white drop-shadow-md">
              {slide.title}
            </h2>
          )}

          {slide.subtitle && (
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-xs max-w-xl font-medium">
              {slide.subtitle}
            </p>
          )}

          {slide.targetCategory ? (
            <div className="pt-2">
              <Link
                href={`/browse?category=${encodeURIComponent(slide.targetCategory)}`}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-transform active:scale-95 shadow-lg"
              >
                <span>Shop Category</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : null}
        </div>

        {/* Carousel Slider Controls (Left / Right Arrow) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
              title="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
              title="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === activeSlide % activeBanners.length
                      ? 'w-6 bg-brand-500'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
