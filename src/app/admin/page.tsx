'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductManager } from '@/components/admin/ProductManager';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { OrderStream } from '@/components/admin/OrderStream';
import { PaymentConfigManager } from '@/components/admin/PaymentConfigManager';
import { CouponManager } from '@/components/admin/CouponManager';
import { UserManagement } from '@/components/admin/UserManagement';
import { useAuth } from '@/context/AuthContext';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_PAYMENT_ACCOUNTS,
  MOCK_COUPONS,
  STORE_LOCATION
} from '@/lib/mockData';
import { Category, Product, Order, PaymentAccount, Coupon } from '@/types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Tag,
  Users,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  AlertCircle,
  Eye,
  X,
  ArrowLeft,
  Lock,
  Layers
} from 'lucide-react';

import {
  subscribeToCategories,
  subscribeToProducts,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore
} from '@/lib/storeService';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'orders' | 'users' | 'payments' | 'coupons'>('inventory');
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);

  // Dynamic State in CMS
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(MOCK_PAYMENT_ACCOUNTS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);

  // Sync state with Firestore database and LocalStorage
  useEffect(() => {
    const unsubCat = subscribeToCategories((items) => {
      if (items && items.length > 0) setCategories(items);
    });
    const unsubProd = subscribeToProducts((items) => {
      if (items && items.length > 0) setProducts(items);
    });

    const savedCategories = localStorage.getItem('adnan_categories');
    if (savedCategories) {
      try { setCategories(JSON.parse(savedCategories)); } catch (e) {}
    }
    const savedProducts = localStorage.getItem('adnan_products');
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch (e) {}
    }
    const savedOrders = localStorage.getItem('adnan_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
    }
    const savedCoupons = localStorage.getItem('adnan_coupons');
    if (savedCoupons) {
      try { setCoupons(JSON.parse(savedCoupons)); } catch (e) {}
    }

    return () => {
      unsubCat();
      unsubProd();
    };
  }, []);

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem('adnan_categories', JSON.stringify(updated));
  };

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('adnan_products', JSON.stringify(updated));
  };

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('adnan_orders', JSON.stringify(updated));
  };

  const saveCoupons = (updated: Coupon[]) => {
    setCoupons(updated);
    localStorage.setItem('adnan_coupons', JSON.stringify(updated));
  };

  // Category CRUD Handlers
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const category: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    const updated = [...categories, category];
    saveCategories(updated);
    saveCategoryToFirestore(category);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    const updated = categories.map(c => c.id === updatedCat.id ? updatedCat : c);
    saveCategories(updated);
    saveCategoryToFirestore(updatedCat);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    saveCategories(updated);
    deleteCategoryFromFirestore(id);
  };

  // Product CRUD Handlers
  const handleAddProduct = (newP: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newP,
      id: `p-${Date.now()}`,
    };
    const updated = [product, ...products];
    saveProducts(updated);
    saveProductToFirestore(product);
  };

  const handleUpdateProduct = (updatedP: Product) => {
    const updated = products.map((p) => (p.id === updatedP.id ? updatedP : p));
    saveProducts(updated);
    saveProductToFirestore(updatedP);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    deleteProductFromFirestore(id);
  };

  // Order status CRUD
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
  };

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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <Header onOpenSearch={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Admin Banner & Live Customer Preview Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                Adnan Super Store Admin CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Management & Control Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time inventory manager, categories catalog, user registry & order stream for <strong>{STORE_LOCATION}</strong>.
            </p>
          </div>

          {/* Live Preview Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setLivePreviewOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 border border-slate-700"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Live Preview Modal</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 border border-emerald-500/30 active:scale-95"
            >
              <span>Open Store Tab</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Rs. {totalRevenue}</h3>
            </div>
            <div className="p-3 bg-emerald-100 text-brand-700 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Active Orders</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</h3>
              {pendingOrders > 0 && (
                <span className="text-[10px] text-amber-600 font-bold">{pendingOrders} Pending Action</span>
              )}
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Catalog Items</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Out of Stock</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{outOfStockCount}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-700 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'inventory'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'categories'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories Catalog ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x relative ${
              activeTab === 'orders'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Real-time Orders ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'users'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'payments'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Setup ({paymentAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'coupons'
                ? 'bg-white text-brand-700 border-slate-200 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Offers ({coupons.length})</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50">
          {activeTab === 'inventory' && (
            <ProductManager
              products={products}
              categories={categories}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              products={products}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'orders' && (
            <OrderStream
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}

          {activeTab === 'payments' && (
            <PaymentConfigManager
              accounts={paymentAccounts}
              onSaveAccounts={setPaymentAccounts}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponManager
              coupons={coupons}
              onSaveCoupons={saveCoupons}
            />
          )}
        </div>

      </main>

      {/* Storefront Live Preview Modal */}
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
