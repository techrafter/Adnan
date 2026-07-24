'use client';

import React from 'react';
import Image from 'next/image';
import { Order } from '@/types';
import { Clock, CheckCircle2, Truck, PackageCheck, ExternalLink, Phone, MapPin, Eye } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface OrderStreamProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export const OrderStream: React.FC<OrderStreamProps> = ({ orders, onUpdateStatus }) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]"><Clock className="w-3.5 h-3.5" /> Pending Payment</span>;
      case 'Paid':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Payment Verified</span>;
      case 'Shipped':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]"><PackageCheck className="w-3.5 h-3.5" /> Delivered</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg text-slate-900">Live Order Stream</h4>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono">
          Total Orders: {orders.length}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-sm text-brand-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  #{order.id}
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{order.customerName}</h5>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-400" /> {order.customerPhone}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Delivery Address (Shve Ada City)
                </span>
                <p className="text-slate-700 font-medium flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </p>
                {order.notes && (
                  <p className="text-[11px] text-amber-700 mt-1 italic">Notes: "{order.notes}"</p>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Payment Details
                </span>
                <p className="text-slate-700 font-bold">
                  Method: <span className="text-brand-700">{order.paymentMethod}</span>
                </p>
                <p className="text-slate-900 font-extrabold text-sm">
                  Total Paid: Rs. {order.totalAmount}
                </p>
              </div>
            </div>

            {/* Items table summary */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ordered Items ({order.items.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-lg">
                    <strong>{item.name}</strong> x {item.quantity} ({item.unit}) - Rs. {item.price * item.quantity}
                  </span>
                ))}
              </div>
            </div>

            {/* Cloudinary Payment Receipt Image Preview */}
            {order.receiptUrl ? (
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Customer Uploaded Payment Receipt Screenshot (Cloudinary)
                </span>
                <a
                  href={order.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-brand-800 p-2 rounded-xl border border-emerald-200 text-xs font-bold transition-colors"
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-300">
                    <Image
                      src={getOptimizedImageUrl(order.receiptUrl, 100)}
                      alt="Receipt Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>View Full Cloudinary Receipt Screenshot</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                </a>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No receipt attached (Cash on Delivery or direct payment).</p>
            )}

            {/* Status Selector dropdown */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Update Order Status:</span>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid (Verified)</option>
                <option value="Shipped">Shipped (Out for Delivery)</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
