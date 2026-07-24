'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Order } from '@/types';
import { Clock, CheckCircle2, Truck, PackageCheck, ExternalLink, Phone, MapPin, Eye, AlertOctagon, Archive, CheckCheck, XCircle } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { STORE_LOCATION } from '@/lib/mockData';

interface OrderStreamProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export const OrderStream: React.FC<OrderStreamProps> = ({ orders, onUpdateStatus }) => {
  const [subTab, setSubTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const activeOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Paid' || o.status === 'Shipped');
  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');

  const displayedOrders = 
    subTab === 'active' ? activeOrders :
    subTab === 'completed' ? completedOrders :
    cancelledOrders;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] border border-amber-200"><Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Payment</span>;
      case 'Paid':
        return <span className="bg-blue-100 text-blue-900 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] border border-blue-200"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Payment Verified</span>;
      case 'Shipped':
        return <span className="bg-purple-100 text-purple-900 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] border border-purple-200"><Truck className="w-3.5 h-3.5 text-purple-600" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] border border-emerald-200"><PackageCheck className="w-3.5 h-3.5 text-emerald-600" /> Delivered</span>;
      default:
        return <span className="bg-red-100 text-red-900 font-extrabold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] border border-red-200"><XCircle className="w-3.5 h-3.5 text-red-600" /> Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Sub-Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h4 className="font-extrabold text-lg text-slate-900">Real-Time Order Stream</h4>
          <p className="text-xs text-slate-500">Live incoming customer orders for {STORE_LOCATION}</p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              subTab === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Active ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setSubTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              subTab === 'completed'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed ({completedOrders.length})</span>
          </button>

          <button
            onClick={() => setSubTab('cancelled')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              subTab === 'cancelled'
                ? 'bg-white text-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled ({cancelledOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Orders List Display */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Archive className="w-8 h-8" />
            </div>
            <h5 className="font-extrabold text-slate-800 text-base">
              {subTab === 'active' && 'No Active Orders Currently'}
              {subTab === 'completed' && 'No Completed Orders Yet'}
              {subTab === 'cancelled' && 'No Cancelled Orders'}
            </h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {subTab === 'active' && 'New customer orders placed on the storefront will appear here live in real-time.'}
              {subTab === 'completed' && 'Orders marked as Delivered will be archived in this section.'}
              {subTab === 'cancelled' && 'Orders marked as Cancelled will appear here.'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-brand-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    #{order.id}
                  </span>
                  <div>
                    <h5 className="font-extrabold text-base text-slate-900">{order.customerName}</h5>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {order.customerPhone}
                      <span>•</span>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Address & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Delivery Address ({order.city || STORE_LOCATION})
                  </span>
                  <p className="text-slate-800 font-bold flex items-start gap-1.5 leading-snug">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{order.address}</span>
                  </p>
                  {order.notes && (
                    <p className="text-[11px] text-amber-800 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200/80 font-medium">
                      Customer Note: "{order.notes}"
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Payment & Amount
                  </span>
                  <p className="text-slate-800 font-bold text-xs">
                    Method: <span className="text-brand-700">{order.paymentMethod}</span>
                  </p>
                  <p className="text-slate-900 font-black text-base mt-1">
                    Total Order Value: <span className="text-brand-700">Rs. {order.totalAmount.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              {/* Ordered Items Table Summary */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Ordered Items ({order.items.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium">
                      <strong className="text-slate-900 font-bold">{item.name}</strong> x {item.quantity} ({item.unit}) — <span className="text-brand-700 font-bold">Rs. {item.price * item.quantity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Cloudinary Payment Receipt Image Preview */}
              {order.receiptUrl ? (
                <div className="pt-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Customer Payment Receipt Screenshot
                  </span>
                  <a
                    href={order.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-emerald-50 hover:bg-emerald-100 text-brand-900 p-2.5 rounded-2xl border border-emerald-200 text-xs font-bold transition-colors shadow-xs"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-300 shrink-0">
                      <Image
                        src={getOptimizedImageUrl(order.receiptUrl, 150)}
                        alt="Receipt Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span>View Full Receipt Screenshot</span>
                      <p className="text-[10px] text-emerald-700 font-normal">Click to view high-res uploaded receipt</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-brand-600 ml-1" />
                  </a>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Payment mode: Direct / Cash on Delivery (COD).</p>
              )}

              {/* Status Selector dropdown */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Change Order Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                  className="bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="Pending">Pending Payment</option>
                  <option value="Paid">Paid (Verified)</option>
                  <option value="Shipped">Shipped (Out for Delivery)</option>
                  <option value="Delivered">Delivered (Move to Completed)</option>
                  <option value="Cancelled">Cancelled (Move to Cancelled)</option>
                </select>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
