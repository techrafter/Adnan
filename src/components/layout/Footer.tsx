'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { STORE_LOCATION } from '@/lib/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Store Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-brand-500 font-serif text-3xl font-bold">بازار</span>
              <span className="font-sans font-extrabold text-white text-xl">ADNAN SUPER STORE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your premier local online superstore providing fresh groceries, farm produce, beverages, and household essentials exclusively to residents of <strong>{STORE_LOCATION}</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-2 rounded-xl w-fit border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>100% Quality & Freshness Guarantee</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Shopping Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Milk & Fresh Dairy</Link></li>
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Fruits & Vegetables</Link></li>
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Adnan Select Spices</Link></li>
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Frozen Foods & Meat</Link></li>
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Cleaning & Homecare</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Support & Hours */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Store Timings & Service</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Open Daily: 08:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Main Bazaar Road, {STORE_LOCATION}, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+92 334 8699487 (WhatsApp Direct)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@adnansuperstore.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods Supported */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Payment Options</h5>
            <p className="text-xs text-slate-400">
              Pay securely via EasyPaisa, JazzCash, IBFT Bank Transfer, or Cash on Delivery at your doorstep.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-800">EasyPaisa</span>
              <span className="bg-red-950 text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-red-800">JazzCash</span>
              <span className="bg-blue-950 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-800">Meezan IBFT</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">Cash on Delivery</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Adnan Super Store ({STORE_LOCATION}). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Shve Ada City
          </p>
        </div>

      </div>
    </footer>
  );
};
