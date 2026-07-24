'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, MapPin, User, Shield, PhoneCall, LogOut, Package, Map, Settings, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { STORE_LOCATION } from '@/lib/mockData';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { cart, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // User avatar helper
  const renderAvatar = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt={user.name || 'User'}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
        />
      );
    }
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';
    return (
      <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner">
        {initials}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-brand-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚡ Fast Grocery Delivery Exclusively in <strong className="text-white underline">{STORE_LOCATION}</strong></span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline flex items-center gap-1"><PhoneCall className="w-3 h-3 text-emerald-400" /> Helpline: +92 334 8699487</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo & Location */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    ADNAN
                  </span>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-600">Super Store</span>
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

            {/* Central Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-100 text-slate-500 rounded-full px-4 py-2.5 sm:py-3 text-sm transition-all border border-transparent hover:border-slate-200 shadow-inner group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors shrink-0" />
                  <span className="truncate text-slate-400 text-xs sm:text-sm">Search fresh fruits, vegetables, staples in Shve Ada...</span>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-white text-slate-400 px-2 py-0.5 rounded-md border border-slate-200">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Admin Link if Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors border border-emerald-300"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Account / User Button & Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-700 border border-slate-200/80"
                  >
                    {renderAvatar()}
                    <span className="hidden lg:inline text-xs font-extrabold text-slate-800 truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email || user.phone}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/profile?tab=orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Order History</span>
                        </Link>

                        <Link
                          href="/profile?tab=addresses"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                        >
                          <Map className="w-4 h-4 text-slate-400" />
                          <span>Saved Addresses</span>
                        </Link>

                        <Link
                          href="/profile?tab=settings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Account Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100 my-1"
                          >
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span>Admin CMS</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Sign Up</span>
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

      {/* Modern Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
