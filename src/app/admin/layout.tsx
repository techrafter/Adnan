'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { Category, Product, Order, PaymentAccount, Coupon } from '@/types';
import {
  MOCK_ORDERS,
  MOCK_PAYMENT_ACCOUNTS,
  MOCK_COUPONS,
  STORE_LOCATION
} from '@/lib/mockData';
import {
  Package,
  ShoppingBag,
  CreditCard,
  Tag,
  Users,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Eye,
  X,
  ArrowLeft,
  Lock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { categories, products, banners } = useCatalog();
  const pathname = usePathname();
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

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
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Header onOpenSearch={() => {}} />
        <main className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-md">
          <ShieldCheck className="w-12 h-12 text-brand-600 mx-auto mb-3 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-800">Verifying Admin Permissions...</h2>
          <p className="text-xs text-slate-500 mt-1">Checking Firebase user role database record.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Strict Protection: If not logged in OR not Admin, block access completely!
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-100">
        <Header onOpenSearch={() => {}} />
        <main className="max-w-lg mx-auto my-16 px-4">
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
        <Footer />
      </div>
    );
  }

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  const tabs = [
    { name: 'Promotional Banners', href: '/admin/banners', icon: ImageIcon, count: banners ? banners.length : 0 },
    { name: 'Product Inventory', href: '/admin/products', icon: Package, count: products.length },
    { name: 'Categories Catalog', href: '/admin/categories', icon: Layers, count: categories.length },
    { name: 'Real-time Orders', href: '/admin/orders', icon: ShoppingBag, count: orders.length, badge: pendingOrders },
    { name: 'User Registry', href: '/admin/users', icon: Users },
    { name: 'Payment Setup', href: '/admin/payments', icon: CreditCard, count: paymentAccounts.length },
    { name: 'Coupons & Offers', href: '/admin/coupons', icon: Tag, count: coupons.length },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <Header onOpenSearch={() => {}} />

      {/* FULL WIDE SCREEN ADMIN MAIN CONTAINER */}
      <main className="w-full px-3 sm:px-6 lg:px-8 py-6">
        
        {/* Full Width Grid with Left Sidebar & Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION TABS */}
          <aside className="lg:col-span-3 xl:col-span-2.5 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm sticky top-20 z-20">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">Admin CMS Panel</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{STORE_LOCATION}</span>
              </div>
            </div>

            {/* Vertical Sidebar Nav Items */}
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href || (pathname === '/admin' && tab.href === '/admin/products');

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-3.5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-between gap-3 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
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
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 hidden lg:block">
              <button
                onClick={() => setLivePreviewOpen(true)}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Preview Modal</span>
              </button>

              <Link
                href="/"
                target="_blank"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <span>Open Customer Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* RIGHT WORKSPACE AREA */}
          <section className="lg:col-span-9 xl:col-span-9.5 space-y-6">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">Rs. {totalRevenue}</h3>
                </div>
                <div className="p-2.5 bg-emerald-100 text-brand-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{orders.length}</h3>
                </div>
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Products</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{products.length}</h3>
                </div>
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Banners</p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{banners ? banners.length : 0}</h3>
                </div>
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Active Sub-route Content */}
            <div>
              {children}
            </div>

          </section>

        </div>

      </main>

      {/* Live Preview Modal */}
      {livePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-extrabold">Live Storefront Customer View Preview</span>
              </div>
              <button
                onClick={() => setLivePreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe
              src="/"
              className="w-full flex-1 border-none"
              title="Adnan Super Store Customer View"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
