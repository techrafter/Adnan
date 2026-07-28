'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/types';
import { MOCK_CATEGORIES, STORE_LOCATION } from '@/lib/mockData';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface CategoryGridProps {
  categories?: Category[];
  onSelectCategory?: (slug: string) => void;
  selectedCategory?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories = [], 
  onSelectCategory, 
  selectedCategory 
}) => {
  const handleCategoryClick = (cat: Category) => {
    if (onSelectCategory) {
      onSelectCategory(cat.slug);
    }
    // Smooth scroll to target category section on index page
    const sectionId = `category-section-${cat.slug || cat.id}`;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Store Categories</h3>
          <p className="text-[11px] sm:text-xs text-slate-500">Browse everyday fresh essentials in {STORE_LOCATION}</p>
        </div>
        {selectedCategory && selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory && onSelectCategory('all')}
            className="text-[11px] sm:text-xs font-extrabold text-brand-600 hover:underline bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200"
          >
            Show All
          </button>
        )}
      </div>

      {/* Grid of 9 Compact Category Thumbnails per line */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-1.5 sm:gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`group relative flex flex-col items-center justify-start p-1.5 sm:p-2 rounded-2xl transition-all duration-200 text-center cursor-pointer min-w-0 w-full ${
                isSelected
                  ? 'bg-brand-50 border-2 border-brand-500 shadow-sm scale-102'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              {/* Category Icon / Thumbnail */}
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 mb-1 rounded-xl overflow-hidden bg-slate-50 p-0.5 shadow-2xs group-hover:scale-105 transition-transform border border-slate-100 shrink-0">
                <Image
                  src={getOptimizedImageUrl(cat.icon || '/placeholder.png', 120)}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Title with Full Visibility (No line-clamp truncation) */}
              <span className={`text-[10px] sm:text-[11px] font-extrabold leading-tight break-words text-center w-full mt-0.5 ${
                isSelected ? 'text-brand-900' : 'text-slate-800 group-hover:text-slate-900'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
