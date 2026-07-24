'use client';

import React from 'react';
import Image from 'next/image';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface CategoryGridProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, selectedCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Categories</h3>
          <p className="text-xs text-slate-500">Browse everyday essentials in Shve Ada City</p>
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Grid of Soft Cards (Bazaar Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
        {MOCK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-200 text-center ${
                isSelected
                  ? 'bg-emerald-50 border-2 border-brand-500 shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100/90 border border-slate-100 hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              {/* Category Icon / Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-xl overflow-hidden bg-white p-1.5 shadow-xs group-hover:scale-105 transition-transform">
                <Image
                  src={getOptimizedImageUrl(cat.icon, 200)}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Title */}
              <span className={`text-xs font-semibold leading-tight line-clamp-2 ${
                isSelected ? 'text-brand-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {cat.name}
              </span>

              {cat.itemCount && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.itemCount} items
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
