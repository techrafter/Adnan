'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import { Order } from '@/types';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ImageIcon,
  ShieldCheck,
  Tag,
  CreditCard
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { categories, products, banners } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('adnan_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {}
  }, []);

  // Stats Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'Cancelled' ? sum + (o.totalAmount || 0) : sum),
    0
  );
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered' || o.status === 'Completed').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;

  const outOfStockProducts = products.filter((p) => !p.inStock);
  const outOfStockCount = outOfStockProducts.length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500/30">
            Adnan Super Store CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Store Overview Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time telemetry on revenue, sales orders, product stock levels, and store categories.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/admin/products"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl transition-all border border-white/20 flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* Main 5 Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Rs. {totalRevenue.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>From delivered orders</span>
          </p>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{orders.length}</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {pendingOrdersCount} Pending
            </span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {completedOrdersCount} Done
            </span>
          </div>
        </div>

        {/* 3. Products Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Products</span>
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Active in catalog
          </p>
        </div>

        {/* 4. Categories Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{categories.length}</h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Store departments
          </p>
        </div>

        {/* 5. Out of Stock Count */}
        <div className={`p-5 rounded-3xl border shadow-2xs space-y-2 ${
          outOfStockCount > 0
            ? 'bg-red-50/80 border-red-200 text-red-900'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Out of Stock</span>
            <div className={`p-2.5 rounded-2xl ${outOfStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black">{outOfStockCount}</h3>
          <p className="text-[11px] font-semibold">
            {outOfStockCount > 0 ? 'Action needed: Restock items' : 'All items in stock'}
          </p>
        </div>

      </div>

      {/* Out of Stock Items Alert Section */}
      {outOfStockCount > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Out of Stock Alert List ({outOfStockCount})</h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
            >
              <span>Update Stock Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStockProducts.map((p) => (
              <div key={p.id} className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-center gap-3">
                {p.image && (
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase">{p.category} • Rs. {p.price}</p>
                </div>
                <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                  Out of stock
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Quick Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span>Recent Orders Summary</span>
            </h3>
            <Link href="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline">
              View All ({orders.length})
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-2.5">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-extrabold text-slate-900">Order #{order.id.slice(-6)}</span>
                    <p className="text-[10px] text-slate-500">{order.customerName} • {order.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900">Rs. {order.totalAmount}</span>
                    <div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No customer orders placed yet.</p>
          )}
        </div>

        {/* CMS Shortcut Center */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Store CMS Quick Management</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2 group"
            >
              <Package className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Products Inventory</h4>
                <p className="text-[10px] text-slate-500">{products.length} products listed</p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2 group"
            >
              <Layers className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Categories Catalog</h4>
                <p className="text-[10px] text-slate-500">{categories.length} categories active</p>
              </div>
            </Link>

            <Link
              href="/admin/banners"
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2 group"
            >
              <ImageIcon className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Promo Banners</h4>
                <p className="text-[10px] text-slate-500">{banners ? banners.length : 0} banners configured</p>
              </div>
            </Link>

            <Link
              href="/admin/payments"
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2 group"
            >
              <CreditCard className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Payment Accounts</h4>
                <p className="text-[10px] text-slate-500">EasyPaisa, JazzCash, IBFT</p>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
