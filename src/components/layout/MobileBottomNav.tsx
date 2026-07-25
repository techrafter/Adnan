'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, ShoppingBag, Package, User, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSearch, onOpenAuth }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setIsCartOpen, subtotal } = useCart();
  const { user, isAdmin } = useAuth();

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
      
      {/* 1. Home / Store */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
          pathname === '/' ? 'text-brand-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Store</span>
      </Link>

      {/* 2. Quick Search / Browse */}
      <Link
        href="/browse"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
          pathname === '/browse' ? 'text-brand-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Search className="w-5 h-5 mb-0.5" />
        <span>Browse</span>
      </Link>

      {/* 3. Cart Button with Counter Badge */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 hover:text-brand-600 transition-all relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </div>
        <span>Rs. {subtotal}</span>
      </button>

      {/* 4. My Orders */}
      <button
        onClick={() => {
          if (!user) {
            onOpenAuth();
          } else {
            router.push('/profile?tab=orders');
          }
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
          pathname === '/profile' ? 'text-brand-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Package className="w-5 h-5 mb-0.5" />
        <span>Orders</span>
      </button>

      {/* 5. Account / Settings (or Admin CMS) */}
      {isAdmin ? (
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
            pathname === '/admin' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-emerald-600'
          }`}
        >
          <Shield className="w-5 h-5 mb-0.5 text-emerald-600" />
          <span>CMS Panel</span>
        </a>
      ) : (
        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              if (typeof window !== 'undefined') {
                window.location.href = '/profile';
              }
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
            pathname === '/profile' ? 'text-brand-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Account</span>
        </button>
      )}

    </nav>
  );
};
