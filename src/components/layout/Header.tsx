'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Shield, PhoneCall, LogOut, Package, Map, Settings, ChevronDown } from 'lucide-react';
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
        <div className="bg-brand-900 text-emerald-100 text-xs py-2 px-4 text-center font-semibold flex items-center justify-center gap-2 tracking-wide">
          <span>✨ First Premier Online Grocery Store in <strong className="text-white underline">Razzar</strong> | Ultra-Fast Express Doorstep Delivery</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
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
            </div>

            {/* Expanded Central Search Bar */}
            <div className="flex-1 max-w-4xl mx-2 sm:mx-6">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between bg-slate-100/90 hover:bg-slate-100 text-slate-500 rounded-full pl-4 pr-1.5 py-1.5 sm:py-2 text-sm transition-all border border-slate-200/80 hover:border-brand-500/30 shadow-inner group"
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors shrink-0" />
                  <span className="truncate text-slate-400 text-xs sm:text-sm font-medium">Search fresh fruits, vegetables, spices, oil, milk in Shve Ada...</span>
                </div>

                <div className="bg-brand-600 group-hover:bg-brand-700 text-white rounded-full p-2 flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <Search className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
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

                        {/* Admin CMS option inside Profile Dropdown only */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100 my-1"
                          >
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span>CMS</span>
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
