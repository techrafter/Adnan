'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Order } from '@/types';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { STORE_LOCATION } from '@/lib/mockData';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { 
  CheckCircle2, 
  MessageSquareCode, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Printer
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 1. Try loading latest order from localStorage
      const latestOrderJson = localStorage.getItem('adnan_latest_order');
      let foundOrder: Order | null = latestOrderJson ? JSON.parse(latestOrderJson) : null;

      // 2. If ID specified in URL, try matching from adnan_orders list
      if (orderIdFromUrl) {
        const allOrdersJson = localStorage.getItem('adnan_orders');
        if (allOrdersJson) {
          const allOrders: Order[] = JSON.parse(allOrdersJson);
          const matched = allOrders.find((o) => o.id === orderIdFromUrl || o.id === `ORD-${orderIdFromUrl}`);
          if (matched) {
            foundOrder = matched;
          }
        }
      }

      setOrder(foundOrder);
    } catch (e) {
      console.error('Error loading order success details', e);
    } finally {
      setLoading(false);
    }
  }, [orderIdFromUrl]);

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 bg-brand-100 rounded-full animate-pulse mx-auto mb-3 flex items-center justify-center text-brand-600">
          <ShoppingBag className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-bold text-slate-600">Retrieving order receipt details...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <FileText className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Recent Order Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          We couldn't locate recent order details. Please browse our storefront to place a new order.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </main>
    );
  }

  const whatsappUrl = generateWhatsAppOrderUrl(order);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-1 font-sans">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print / Save Receipt</span>
        </button>
      </div>

      {/* Hero Order Success Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md mb-8 text-center relative overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-5 leading-relaxed">
          Thank you for your order with <strong>Adnan Super Store</strong>. Your order payload has been saved and pre-filled for instant WhatsApp dispatch.
        </p>

        {/* Order ID Pill */}
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-900">
          <span>Order ID:</span>
          <span className="font-mono text-brand-700">#{order.id}</span>
          <button
            onClick={handleCopyOrderId}
            className="ml-1 p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-900"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2-Column Professional Detailed Order Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Side (7 Cols): Itemized Order Items Table & Financials */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <span>Items Purchased</span>
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* Table / List of Ordered Items */}
            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/60 shrink-0 p-0.5">
                      <Image
                        src={getOptimizedImageUrl(item.image || '/placeholder.png', 120)}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Rs. {item.price} × {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-right shrink-0 text-xs sm:text-sm">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Summary Breakdown Box */}
            <div className="pt-4 border-t border-slate-200 text-xs space-y-2.5 text-slate-600 bg-slate-50/70 p-4 rounded-2xl">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rs. {order.subtotal.toLocaleString()}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-accent-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee ({order.city})</span>
                <span className="font-bold text-slate-900">
                  {order.deliveryFee === 0 ? <strong className="text-accent-600 uppercase">FREE</strong> : `Rs. ${order.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount Paid / Due</span>
                <span className="text-brand-700">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side (5 Cols): Delivery Address, Payment Details & WhatsApp Action */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customer & Delivery Card */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Recipient Name</p>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Phone</p>
                  <p className="font-mono font-bold text-slate-900">{order.customerPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery Address</p>
                  <p className="font-semibold text-slate-900">{order.address}, {order.city}</p>
                </div>
              </div>

              {order.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] italic text-slate-600">
                  "Note: {order.notes}"
                </div>
              )}
            </div>
          </div>

          {/* Payment & Receipt Verification Card */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Payment Details</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                {order.status || 'Pending Verification'}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium">Selected Payment Method:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>

              {order.receiptUrl ? (
                <div className="bg-brand-50/80 border border-brand-200 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-900 font-bold text-xs">Payment Screenshot Uploaded</span>
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-brand-700 font-extrabold hover:underline flex items-center gap-1"
                    >
                      <span>View Full Image</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-brand-300 bg-white">
                    <Image
                      src={getOptimizedImageUrl(order.receiptUrl, 400)}
                      alt="Uploaded Payment Receipt"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Payment to be collected via Cash on Delivery or confirmed upon order processing.
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <MessageSquareCode className="w-5 h-5" />
              <span>Open / Resend Order on WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs text-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Grocery Shopping</span>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Order details safely stored in your session</span>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header onOpenSearch={() => {}} />
      <Suspense fallback={
        <main className="max-w-4xl mx-auto py-20 px-4 text-center">
          <p className="text-xs font-bold text-slate-600">Loading Order Details...</p>
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
