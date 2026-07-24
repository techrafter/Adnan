'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const BANNERS = [
  {
    id: 1,
    tag: "ADNAN SELECT",
    title: "PREMIUM SPICES AT THE LOWEST PRICES",
    subtitle: "Handpicked traditional recipes, pure aromas, and unmatched quality.",
    cta: "Try Now",
    originalPrice: "Rs. 260",
    discountPrice: "Rs. 155",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&auto=format&fit=crop&q=80",
    bgColor: "from-amber-900 via-amber-950 to-stone-900"
  },
  {
    id: 2,
    tag: "RAZZAR EXCLUSIVE",
    title: "FRESH FARM PRODUCE & DAIRY DAILY",
    subtitle: "Direct from local Razzar farms straight to your kitchen table in under 30 mins.",
    cta: "Shop Produce",
    originalPrice: "Rs. 400",
    discountPrice: "Rs. 320",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1000&auto=format&fit=crop&q=80",
    bgColor: "from-emerald-900 via-emerald-950 to-slate-900"
  }
];

export const HeroBanner: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNERS[activeSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.bgColor} text-white shadow-xl transition-all duration-700 min-h-[220px] sm:min-h-[280px] flex items-center`}>
        
        {/* Background Overlay Texture */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0" />

        <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
          
          {/* Left Text Content */}
          <div className="md:col-span-7 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {slide.tag}
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Guaranteed
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight uppercase font-sans">
              {slide.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-lg">
              {slide.subtitle}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-transform active:scale-95 shadow-lg flex items-center gap-2 group">
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-2xl border border-emerald-500/30">
                <span className="text-xs text-slate-300 line-through">{slide.originalPrice}</span>
                <span className="text-base font-extrabold text-emerald-300">{slide.discountPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Product Image */}
          <div className="hidden md:block md:col-span-5 relative h-48 lg:h-56 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={getOptimizedImageUrl(slide.image, 800)}
              alt={slide.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

        </div>

        {/* Carousel Slider Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-brand-500' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
