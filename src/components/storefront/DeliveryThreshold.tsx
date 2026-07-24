'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Truck, CheckCircle2 } from 'lucide-react';

export const DeliveryThreshold: React.FC = () => {
  const { amountAwayFromFreeDelivery, freeDeliveryThreshold, subtotal } = useCart();
  const percentage = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="bg-emerald-50/80 border-y border-emerald-100/80 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        
        <div className="flex items-center gap-2 font-semibold text-emerald-900">
          <Truck className="w-4 h-4 text-brand-600 animate-pulse shrink-0" />
          {amountAwayFromFreeDelivery > 0 ? (
            <span>
              💵 You are <span className="font-extrabold text-brand-700 underline">Rs. {amountAwayFromFreeDelivery}</span> away from <strong>FREE Home Delivery</strong> in Shve Ada City!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-brand-700 font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> Congratulations! You have unlocked FREE Home Delivery in Shve Ada City.
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 bg-emerald-200/60 rounded-full h-2 overflow-hidden shrink-0">
          <div
            className="bg-brand-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

      </div>
    </div>
  );
};
