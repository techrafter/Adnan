'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { Order, PaymentAccount, Coupon } from '@/types';
import { STORE_LOCATION } from '@/lib/mockData';
import {
  Package,
  ShoppingBag,
  CreditCard,
  Tag,
  Users,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Layers,
  Image as ImageIcon,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const { categories, products, banners } = useCatalog();
  const pathname = usePathname();

  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings dropdown toggle state
  const isSettingsRoute = [
    '/admin/logo',
    '/admin/settings',
    '/admin/categories',
    '/admin/payments',
    '/admin/coupons'
  ].includes(pathname);

  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsRoute);

  useEffect(() => {
    if (isSettingsRoute) {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('adnan_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedCoupons = localStorage.getItem('adnan_coupons');
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
    } catch (e) {}
  }, []);

  // Strict Protection: Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md w-full p-8 bg-slate-800 rounded-3xl border border-slate-700 text-center shadow-2xl space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-slate-100">Verifying Admin Permissions...</h2>
          <p className="text-xs text-slate-400">Checking Firebase user role record.</p>
        </div>
      </div>
    );
  }

  // Strict Protection: If not logged in OR not Admin, block access completely!
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <main className="max-w-md w-full">
          <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Unauthorized Access Blocked
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">Admin Permissions Required</h2>
              <p className="text-xs text-slate-500 mt-2">
                This CMS dashboard is strictly restricted. Only users with <strong className="text-slate-800">isAdmin = true</strong> in Firebase Firestore can access store management.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1 text-slate-600">
              <p><strong>Your Account:</strong> {user ? user.email || user.phone : 'Not Signed In'}</p>
              <p><strong>Status:</strong> <span className="text-red-600 font-bold">Regular Customer Account</span></p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Stats calculation
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  const mainTabs = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Product Inventory', href: '/admin/products', icon: Package, count: products.length },
    { name: 'Real-time Orders', href: '/admin/orders', icon: ShoppingBag, count: orders.length, badge: pendingOrders },
    { name: 'Promotional Banners', href: '/admin/banners', icon: ImageIcon, count: banners ? banners.length : 0 },
    { name: 'User Registry', href: '/admin/users', icon: Users },
  ];

  const settingsSubTabs = [
    { name: 'Website Logo', href: '/admin/logo', icon: ImageIcon },
    { name: 'Categories Catalog', href: '/admin/categories', icon: Layers, count: categories.length },
    { name: 'Payment Setup', href: '/admin/payments', icon: CreditCard, count: paymentAccounts.length },
    { name: 'Coupons & Offers', href: '/admin/coupons', icon: Tag, count: coupons.length },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row antialiased">
      
      {/* MOBILE TOP BAR (Only visible on small screens) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center font-black text-sm text-white">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-none">Adnan Admin CMS</h1>
            <span className="text-[9px] text-slate-400 font-medium">{STORE_LOCATION}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* FIXED PERMANENT LEFT SIDEBAR FOR DESKTOP & MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 xl:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRANDING & STORE LINK */}
        <div className="p-5 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                A
              </div>
              <div>
                <h2 className="font-black text-sm text-slate-900 leading-tight">Admin CMS Panel</h2>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Admin</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-extrabold text-xs py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              <span>View Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </Link>
        </div>

        {/* NAVIGATION TABS LIST */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Management Navigation
          </div>

          {/* MAIN TABS */}
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-3.5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-amber-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* COLLAPSIBLE SETTINGS ACCORDION */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-full px-3.5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSettingsRoute && !isSettingsOpen
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Settings className={`w-4 h-4 shrink-0 ${isSettingsRoute ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="truncate">SETTINGS</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isSettingsOpen ? 'rotate-180 text-brand-600' : ''
              }`} />
            </button>

            {/* EXPANDABLE SUB-MENU */}
            {isSettingsOpen && (
              <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 space-y-1 animate-in fade-in duration-150">
                {settingsSubTabs.map((subTab) => {
                  const Icon = subTab.icon;
                  const isActive = pathname === subTab.href || (subTab.href === '/admin/logo' && pathname === '/admin/settings');

                  return (
                    <Link
                      key={subTab.href}
                      href={subTab.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{subTab.name}</span>
                      </div>

                      {subTab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {subTab.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* BOTTOM USER PROFILE & LOGOUT FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate">{user.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || user.phone}</p>
            </div>
            <button
              onClick={() => logout()}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE OVERLAY BACKDROP */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* RIGHT MAIN WORKSPACE CONTENT */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}
