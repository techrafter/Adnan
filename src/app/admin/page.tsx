'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductManager } from '@/components/admin/ProductManager';
import { OrderStream } from '@/components/admin/OrderStream';
import { PaymentConfigManager } from '@/components/admin/PaymentConfigManager';
import { CouponManager } from '@/components/admin/CouponManager';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_PAYMENT_ACCOUNTS,
  MOCK_COUPONS,
  STORE_LOCATION
} from '@/lib/mockData';
import { Product, Order, PaymentAccount, Coupon } from '@/types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Tag,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'payments' | 'coupons'>('inventory');

  // State managed in CMS
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(MOCK_PAYMENT_ACCOUNTS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);

  // Product CRUD
  const handleAddProduct = (newP: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newP,
      id: `p-${Date.now()}`,
    };
    setProducts([product, ...products]);
  };

  const handleUpdateProduct = (updatedP: Product) => {
    setProducts(products.map((p) => (p.id === updatedP.id ? updatedP : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Order status CRUD
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <Header onOpenSearch={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Admin Banner & Live Customer Preview Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Store Admin CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Adnan Super Store Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Real-time product inventory, order stream, payment setup & coupon engine for <strong>{STORE_LOCATION}</strong>.
            </p>
          </div>

          {/* Live Preview Toggle Button */}
          <Link
            href="/"
            target="_blank"
            className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 border border-emerald-500/30"
          >
            <span>Live Customer Storefront Preview</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
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
                <span className="text-[10px] text-amber-600 font-bold">{pendingOrders} Pending Payment</span>
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
                ? 'bg-white text-brand-700 border-slate-200 text-slate-900 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x relative ${
              activeTab === 'orders'
                ? 'bg-white text-brand-700 border-slate-200 text-slate-900 shadow-xs'
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
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 font-extrabold text-xs rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'payments'
                ? 'bg-white text-brand-700 border-slate-200 text-slate-900 shadow-xs'
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
                ? 'bg-white text-brand-700 border-slate-200 text-slate-900 shadow-xs'
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
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrderStream
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
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
              onSaveCoupons={setCoupons}
            />
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
