'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useCart } from '@/context/CartContext';
import { STORE_LOCATION } from '@/lib/mockData';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose, products = [] }) => {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();
  const [activeProducts, setActiveProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (products && products.length > 0) {
      setActiveProducts(products);
    } else {
      try {
        const saved = localStorage.getItem('adnan_products');
        if (saved) {
          setActiveProducts(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, [products, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? activeProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : activeProducts.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 md:p-20">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={`Search groceries, spices, milk, atta in ${STORE_LOCATION}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 text-sm font-medium focus:outline-none placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {query ? `Matching Results (${results.length})` : 'Popular Quick Suggestions'}
          </div>

          {results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50 rounded-xl px-2 transition-colors"
              >
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="relative w-12 h-12 rounded-lg bg-white p-1 border border-slate-100 shrink-0">
                    <Image
                      src={getOptimizedImageUrl(product.image, 200)}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-brand-600 truncate">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Rs. {product.price} • <span className="text-slate-600">{product.unit}</span>
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    onClose();
                  }}
                  className="bg-emerald-50 hover:bg-brand-600 text-brand-700 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching products found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-100 text-[11px] text-slate-400">
          Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">ESC</kbd> to close
        </div>

      </div>
    </div>
  );
};
