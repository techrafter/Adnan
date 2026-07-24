'use client';

import React from 'react';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white border-b border-slate-100 py-2 sticky top-[65px] sm:top-[80px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Horizontal Scroll Container */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            <button
              onClick={() => onSelectCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Products
            </button>

            {MOCK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-emerald-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center pl-4 border-l border-slate-200 shrink-0 text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </div>

        </div>
      </div>
    </div>
  );
};
