'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Truck, CheckCircle2 } from 'lucide-react';

export const DeliveryThreshold: React.FC = () => {
  const { amountAwayFromFreeDelivery, freeDeliveryThreshold, subtotal } = useCart();
  const percentage = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="bg-brand-50/80 border-y border-brand-100 py-3 px-4 shadow-xs">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center gap-2 text-xs">
        
        <div className="flex items-center justify-center gap-2 font-semibold text-slate-900">
          <Truck className="w-4 h-4 text-brand-600 animate-pulse shrink-0" />
          {amountAwayFromFreeDelivery > 0 ? (
            <span>
              💵 You are <span className="font-extrabold text-accent-600 underline">Rs. {amountAwayFromFreeDelivery}</span> away from <strong>FREE Home Delivery</strong> in Razzar!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 text-brand-700 font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-accent-500 inline" /> Congratulations! You have unlocked FREE Home Delivery in Razzar.
            </span>
          )}
        </div>

        {/* Centered Progress Bar */}
        <div className="w-full max-w-md bg-brand-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent-500 h-full transition-all duration-500 rounded-full shadow-inner"
            style={{ width: `${percentage}%` }}
          />
        </div>

      </div>
    </div>
  );
};
