'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Check, Flame } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 hover:border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative">
      
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            {product.discountPercentage}% OFF
          </span>
        )}

        {product.isFlashDeal && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
            <Flame className="w-3 h-3" /> DEAL
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <div>
        <Link href={`/product/${product.id}`} className="block relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-50 mb-3 group-hover:bg-slate-100 transition-colors">
          <Image
            src={getOptimizedImageUrl(product.image, 500)}
            alt={product.name}
            fill
            className={`object-contain p-2 group-hover:scale-105 transition-transform duration-300 ${
              !product.inStock ? 'opacity-40 grayscale' : ''
            }`}
          />

          {!product.inStock && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-2 text-center">
              <span className="bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Category & Unit */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">{product.unit}</span>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="block">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 min-h-[36px] sm:min-h-[40px] leading-snug">
            {product.name}
          </h4>
        </Link>
      </div>

      {/* Price & Cart Add Button */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-slate-400 line-through leading-none">
              Rs. {product.originalPrice}
            </span>
          )}
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            Rs. {product.price}
          </span>
        </div>

        {/* Quantity Toggle / Add Button */}
        {quantityInCart > 0 ? (
          <div className="flex items-center bg-brand-600 text-white rounded-full p-1 shadow-md">
            <button
              onClick={() => updateQuantity(product.id, quantityInCart - 1)}
              className="p-1 hover:bg-brand-700 rounded-full transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-xs min-w-[20px] text-center">{quantityInCart}</span>
            <button
              onClick={() => updateQuantity(product.id, quantityInCart + 1)}
              className="p-1 hover:bg-brand-700 rounded-full transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 shadow-xs ${
              product.inStock
                ? 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        )}
      </div>

    </div>
  );
};
