'use client';

import React from 'react';
import { ShoppingBag, Tag, Truck } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  return (
    <section className="hidden sm:block py-14 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Why Adnan Super Store is Razzar's Best Grocery App
          </h2>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Wide Variety */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-sky-100/80 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Wide Variety of Products
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              From fresh fruits, vegetables & pantry staples to your top local & international brands, Adnan Super Store makes online grocery shopping in Razzar easy. Shop directly on our website or download the Adnan Super Store mobile app.
            </p>
          </div>

          {/* Card 2: Best Prices */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-sky-100/80 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
              <Tag className="w-10 h-10" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Best Prices Every Day
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Get the lowest prices every day when you buy groceries online in Razzar with Adnan Super Store. Enjoy exclusive offers, bundle deals, discounts and multiple payment options including EasyPaisa, JazzCash, Bank Transfer and Cash on Delivery.
            </p>
          </div>

          {/* Card 3: Fast Reliable Delivery */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-sky-100/80 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-inner">
              <Truck className="w-10 h-10" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Fast, Reliable Delivery
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Get your groceries delivered quickly and on time, right to your doorstep. With Adnan Super Store's express delivery service in Razzar, you can count on fresh, high-quality products arriving exactly when you need them.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
