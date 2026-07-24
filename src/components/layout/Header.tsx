'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, MapPin, User, Shield, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { STORE_LOCATION } from '@/lib/mockData';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { cart, setIsCartOpen } = useCart();
  const { user, loginDemoUser, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    const isAdminUser = phoneInput.endsWith('999') || phoneInput.toLowerCase().includes('admin');
    loginDemoUser(nameInput || 'Customer', phoneInput, isAdminUser);
    setShowAuthModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-brand-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚡ Fast Grocery Delivery Exclusively in <strong className="text-white underline">{STORE_LOCATION}</strong></span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline flex items-center gap-1"><PhoneCall className="w-3 h-3 text-emerald-400" /> Helpline: +92 300 1234567</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo & Location */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-1">
                    <span className="text-brand-600 font-serif text-3xl sm:text-4xl">بازار</span>
                    <span className="font-sans font-bold text-slate-900 text-lg sm:text-2xl">ADNAN</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600">Super Store</span>
                </div>
              </Link>

              {/* Location Badge (Locked to Shve Ada City) */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-brand-800">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 animate-bounce" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 leading-tight">Deliver to</span>
                  <span className="font-semibold text-brand-900 flex items-center gap-1">
                    {STORE_LOCATION}, Pakistan
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Central Search Bar (Bazaar style) */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-100 text-slate-500 rounded-full px-4 py-2.5 sm:py-3 text-sm transition-all border border-transparent hover:border-slate-200 shadow-inner group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors shrink-0" />
                  <span className="truncate text-slate-400 text-xs sm:text-sm">What are you looking for today in Shve Ada?</span>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-white text-slate-400 px-2 py-0.5 rounded-md border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Admin Link */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 rounded-full transition-colors border border-slate-200"
              >
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                <span>Admin CMS</span>
              </Link>

              {/* Account / User Button */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700">
                    <User className="w-5 h-5 text-slate-600" />
                    <span className="hidden lg:inline text-xs font-semibold truncate max-w-[100px]">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.phone}</p>
                    </div>
                    <Link href="/admin" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 hover:text-brand-600 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 sm:px-4 sm:py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-transform active:scale-95 shadow-sm flex items-center gap-2"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline font-bold text-xs">Cart</span>
                {totalItemsInCart > 0 && (
                  <span className="bg-white text-brand-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    {totalItemsInCart}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Customer Sign In</h3>
            <p className="text-xs text-slate-500 mb-4">Enter your mobile number to view past orders and track delivery in Shve Ada City.</p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Raza"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +92 300 1234567"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Tip: Add "admin" in phone to toggle Admin access mode.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
