'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/types';
import { MOCK_CATEGORIES, STORE_LOCATION } from '@/lib/mockData';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface CategoryGridProps {
  categories?: Category[];
  onSelectCategory: (slug: string) => void;
  selectedCategory: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories, 
  onSelectCategory, 
  selectedCategory 
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : MOCK_CATEGORIES;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Store Categories</h3>
          <p className="text-[11px] sm:text-xs text-slate-500">Browse everyday fresh essentials in {STORE_LOCATION}</p>
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-[11px] sm:text-xs font-extrabold text-brand-600 hover:underline bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
          >
            Show All
          </button>
        )}
      </div>

      {/* Grid of Soft Cards (Compact App View on Mobile) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-4">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl transition-all duration-200 text-center ${
                isSelected
                  ? 'bg-emerald-50 border-2 border-brand-500 shadow-md scale-102'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Category Icon / Image */}
              <div className="relative w-12 h-12 sm:w-20 sm:h-20 mb-1 rounded-xl overflow-hidden bg-slate-50 p-0.5 shadow-xs group-hover:scale-105 transition-transform border border-slate-100">
                <Image
                  src={getOptimizedImageUrl(cat.icon, 150)}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Title */}
              <span className={`text-[10px] sm:text-xs font-extrabold leading-tight line-clamp-1 ${
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
