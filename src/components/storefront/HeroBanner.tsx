'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
};

export const HeroBanner: React.FC = () => {
  const { banners } = useCatalog();
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  // Filter active and non-expired banners
  const activeBanners = (banners || []).filter((b) => {
    if (b.isActive === false) return false;
    if (b.isForever === false && b.expiresAt) {
      return new Date(b.expiresAt).getTime() > Date.now();
    }
    return true;
  });

  const activeIndex = Math.abs(page % (activeBanners.length || 1));

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  // Auto-slide every 5 seconds (paused when hovered)
  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered, paginate]);

  if (activeBanners.length === 0) {
    return null; // Cleanly hide if no active banners
  }

  const currentBanner = activeBanners[activeIndex % activeBanners.length];

  const renderBannerMedia = (banner: typeof currentBanner) => (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={getOptimizedImageUrl(banner.image, 1400)}
        alt={banner.title || 'Store Banner'}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
        priority
      />
      {/* Subtle ambient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
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
      <div
        className="relative w-full aspect-[3.2/1] sm:aspect-[4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-white/10 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Banner Container with Framer Motion */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 260, damping: 28 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              filter: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                paginate(1);
              } else if (swipe > 10000) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full select-none"
          >
            {renderBannerLink(currentBanner)}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons & Dots (Only if >1 banners exist) */}
        {activeBanners.length > 1 && (
          <>
            {/* Previous Button - Ultra Transparent Glassmorphism */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/20 hover:bg-white/30 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-90"
              title="Previous Banner"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow" />
            </button>

            {/* Next Button - Ultra Transparent Glassmorphism */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-3 sm:left-auto sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/20 hover:bg-white/30 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-90"
              title="Next Banner"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow" />
            </button>

            {/* Slider Dots - Glass Capsule with Animated Pill */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/20 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
              {activeBanners.map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dir = index > activeIndex ? 1 : -1;
                      setPage([index, dir]);
                    }}
                    className="relative focus:outline-none cursor-pointer py-1"
                    title={`Go to banner ${index + 1}`}
                    aria-label={`Go to banner ${index + 1}`}
                  >
                    {isActive ? (
                      <motion.div
                        layoutId="activeBannerDot"
                        className="w-7 h-2 bg-gradient-to-r from-white via-slate-100 to-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/35 hover:bg-white/70 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

