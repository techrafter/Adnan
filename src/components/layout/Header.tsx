'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Shield, LogOut, Package, Map, Settings, ChevronDown, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { STORE_LOCATION } from '@/lib/mockData';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const { cart, setIsCartOpen, subtotal, amountAwayFromFreeDelivery } = useCart();
  const { user, isAdmin, logout, loading } = useAuth();
  const { siteSettings } = useCatalog();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const logoUrl = siteSettings?.logoUrl || '/logo.png';
  const storeName = siteSettings?.storeName || 'ADNAN SUPER STORE';

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      window.location.href = `/browse?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = '/browse';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleNavClick = (tab: string) => {
    setIsDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = `/profile?tab=${tab}`;
    }
  };

  // User avatar helper
  const renderAvatar = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt={user.name || 'User'}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
        />
      );
    }
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';
    return (
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner">
        {initials}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs transition-all">
        {/* Top Free Delivery Threshold Announcement Bar (Visible Everywhere) */}
        <div className="bg-brand-900 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-bold flex items-center justify-center gap-2 tracking-wide">
          {amountAwayFromFreeDelivery > 0 ? (
            <span>
              💵 You are <span className="font-extrabold text-amber-300 underline">Rs. {amountAwayFromFreeDelivery}</span> away from <strong>FREE Home Delivery</strong> in {STORE_LOCATION}!
            </span>
          ) : (
            <span className="text-emerald-300 font-extrabold flex items-center justify-center gap-1">
              🎉 Congratulations! You have unlocked FREE Home Delivery in {STORE_LOCATION}!
            </span>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
            
            {/* Dynamic Store Logo */}
            <div className="flex items-center gap-2 sm:gap-6 shrink-0">
              <Link href="/" className="flex items-center gap-2 group py-1" title={storeName}>
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-9 sm:h-14 w-auto object-contain max-w-[170px] sm:max-w-[240px] group-hover:scale-[1.02] transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to logo.png if custom logo fails to load
                    if (e.currentTarget.src !== window.location.origin + '/logo.png') {
                      e.currentTarget.src = '/logo.png';
                    }
                  }}
                />
              </Link>
            </div>

            {/* Direct Interactive Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-4xl mx-1 sm:mx-4">
              <div className="relative flex items-center bg-slate-100 focus-within:bg-white text-slate-700 rounded-full pl-3 sm:pl-4 pr-1 sm:pr-1.5 py-1 sm:py-1.5 border border-slate-200 focus-within:border-brand-500 shadow-inner transition-all">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Search products in ${STORE_LOCATION}...`}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white rounded-full p-1.5 sm:p-2 flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
                  title="Search Products"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </form>

            {/* Right Desktop Actions (Hidden/Compact on Mobile due to MobileBottomNav) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Account / User Button & Dropdown */}
              {user ? (
                <div className="relative shrink-0">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-700 border border-slate-200/80 cursor-pointer"
                  >
                    {renderAvatar()}
                    <span className="hidden lg:inline text-xs font-extrabold text-slate-800 truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      {/* Transparent backdrop overlay to handle click-outside close */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                          <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email || user.phone}</p>
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleNavClick('profile')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors text-left cursor-pointer"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>My Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('orders')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors text-left cursor-pointer"
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            <span>Order History</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('addresses')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors text-left cursor-pointer"
                          >
                            <Map className="w-4 h-4 text-slate-400" />
                            <span>Saved Addresses</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavClick('settings')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors text-left cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Account Settings</span>
                          </button>

                          {/* Admin CMS option - Opens Admin Panel in a NEW SEPARATE TAB */}
                          {isAdmin && (
                            <a
                              href="/admin"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-2.5 text-xs font-black text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 transition-colors border-t border-slate-100 my-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <span>Admin CMS Panel</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                            </a>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : loading ? (
                /* Auth Loading Skeleton (prevents flashing Login/Signup button) */
                <div className="w-[120px] h-[36px] bg-slate-100 animate-pulse rounded-full border border-slate-200/60 shrink-0" />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </button>
              )}

              {/* Fixed Width Static Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-[130px] sm:w-[145px] h-[40px] bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 px-3 border border-emerald-500/30 group shrink-0"
                aria-label="View Shopping Cart"
              >
                <div className="relative flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  {totalItemsInCart > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-brand-700">
                      {totalItemsInCart}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start leading-none truncate min-w-0">
                  <span className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-widest truncate">
                    {totalItemsInCart > 0 ? `${totalItemsInCart} ${totalItemsInCart === 1 ? 'Item' : 'Items'}` : 'Cart'}
                  </span>
                  <span className="text-xs font-black text-white truncate">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
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
