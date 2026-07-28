'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PaymentGatewaySelector } from '@/components/checkout/PaymentGatewaySelector';
import { ReceiptUploader } from '@/components/checkout/ReceiptUploader';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PAYMENT_ACCOUNTS, STORE_LOCATION } from '@/lib/mockData';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { Order, PaymentAccount } from '@/types';
import { MapPin, ArrowLeft, ShieldCheck, CheckCircle2, MessageSquareCode, ShoppingBag } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export default function CheckoutPage() {
  const { cart, subtotal, discount, deliveryFee, totalAmount, clearCart, isLoaded } = useCart();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Accounts State (Loaded from Admin CMS)
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(MOCK_PAYMENT_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount>(MOCK_PAYMENT_ACCOUNTS[0]);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Load active payment accounts set by Admin in Admin Panel
  useEffect(() => {
    const savedAccounts = localStorage.getItem('adnan_payment_accounts');
    if (savedAccounts) {
      try {
        const parsed: PaymentAccount[] = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaymentAccounts(parsed);
          const activeAccounts = parsed.filter((a) => a.isActive !== false);
          if (activeAccounts.length > 0) {
            // Prefer COD if available, or default to first active payment method
            const codAcc = activeAccounts.find((a) => a.type === 'cod') || activeAccounts[0];
            setSelectedAccount(codAcc);
          }
        }
      } catch (e) {
        console.error('Failed to load admin payment accounts', e);
      }
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Header onOpenSearch={() => {}} />
        <main className="max-w-md mx-auto my-16 px-4 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full animate-pulse mx-auto mb-3 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-brand-600 animate-spin" />
          </div>
          <p className="text-xs font-bold text-slate-600">Loading Checkout Details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Header onOpenSearch={() => {}} />
        <main className="max-w-md mx-auto my-16 px-4 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-xs text-slate-500 mb-6">Add grocery products to your cart before proceeding to checkout.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      alert('Please fill out all required delivery fields (Full Name, Phone, and Address).');
      return;
    }

    if (selectedAccount.type !== 'cod' && (!receiptUrl || !receiptUrl.trim())) {
      alert('Please upload your payment screenshot before placing the order.');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      city: STORE_LOCATION,
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        unit: i.product.unit,
        image: i.product.image,
      })),
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      paymentMethod: selectedAccount.methodName,
      receiptUrl: receiptUrl || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: notes.trim(),
    };

    // Save to real-time order stream for Admin CMS and latest order
    try {
      const savedOrders = localStorage.getItem('adnan_orders');
      const currentOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem('adnan_orders', JSON.stringify([newOrder, ...currentOrders]));
      localStorage.setItem('adnan_latest_order', JSON.stringify(newOrder));
    } catch (e) {
      console.warn('Failed to persist order to local stream:', e);
    }

    // Build pre-filled WhatsApp message URL
    const whatsappUrl = generateWhatsAppOrderUrl(newOrder);
    
    // Clear cart local state
    clearCart();
    setIsSubmitting(false);

    // Open WhatsApp in new tab and redirect current page to /order-success
    try {
      window.open(whatsappUrl, '_blank');
    } catch (e) {}

    window.location.href = `/order-success?id=${newOrder.id}`;
  };

  // Validation logic for Place Order Button
  const isDeliveryInfoValid = Boolean(
    customerName.trim() && customerPhone.trim() && address.trim()
  );
  const isReceiptRequired = selectedAccount.type !== 'cod';
  const isReceiptUploaded = Boolean(receiptUrl && receiptUrl.trim());
  const isPaymentValid = !isReceiptRequired || isReceiptUploaded;
  const isFormValid = isDeliveryInfoValid && isPaymentValid;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
      <Header onOpenSearch={() => {}} />

      {/* Full Web Width Container max-w-7xl */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-1">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 mb-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout & Order Placement</h1>
            <p className="text-xs text-slate-500 mt-0.5">Complete your delivery address and payment verification to place your order.</p>
          </div>

          <div className="flex items-center gap-2 bg-brand-50 border border-brand-200/80 px-3 py-1.5 rounded-2xl text-xs text-brand-900 font-bold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Exclusive Express Delivery to {STORE_LOCATION}</span>
          </div>
        </div>

        {/* 2-Column Professional Wide Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column (7 cols): Customer Details + Payment Gateway + Screenshot Upload */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Delivery Details */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center shadow-xs">1</span>
                  <span>Customer Delivery Details</span>
                </h3>
                {isDeliveryInfoValid ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complete
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Required Details
                  </span>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Mobile Phone / WhatsApp <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. +92 300 1234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Street Address in {STORE_LOCATION} <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    placeholder="House/Shop #, Street name, Near famous landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Call when outside or leave with gate guard"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center shadow-xs">2</span>
                <span>Payment Gateway Selection</span>
              </h3>

              <PaymentGatewaySelector
                accounts={paymentAccounts}
                selectedId={selectedAccount.id}
                onSelect={(account) => {
                  setSelectedAccount(account);
                }}
              />
            </div>

            {/* Step 3: Payment Screenshot Upload (Required for Online Payments) */}
            {selectedAccount.type !== 'cod' && (
              <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center shadow-xs">3</span>
                    <span>Upload Payment Receipt Screenshot</span>
                  </h3>
                  {isReceiptUploaded ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Screenshot Attached
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                      Screenshot Required
                    </span>
                  )}
                </div>

                <ReceiptUploader
                  receiptUrl={receiptUrl}
                  onReceiptUploaded={setReceiptUrl}
                />
              </div>
            )}

          </div>

          {/* Right Column (5 cols): Sticky Summary Sidebar & Active Order Button */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900">Order Summary</h3>
                <span className="bg-brand-50 text-brand-700 text-xs font-extrabold px-2.5 py-1 rounded-full border border-brand-200">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Product items list */}
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100 text-xs">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/60 shrink-0 p-0.5">
                        <Image
                          src={getOptimizedImageUrl(item.product.image, 120)}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-slate-900 truncate text-xs">{item.product.name}</h5>
                        <p className="text-[11px] text-slate-400">Rs. {item.product.price} × {item.quantity} {item.product.unit}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-right shrink-0 text-xs">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-200 text-xs space-y-2.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-accent-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee ({STORE_LOCATION})</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <strong className="text-accent-600 uppercase">FREE</strong> : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-brand-700">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Validation Feedback Banner */}
              {!isFormValid && (
                <div className="bg-amber-50/90 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs font-semibold space-y-1">
                  <p className="font-bold text-amber-950">Action required to unlock Order button:</p>
                  {!isDeliveryInfoValid && (
                    <p className="flex items-center gap-1 text-[11px]">
                      • Enter Full Name, Phone number & Delivery Address.
                    </p>
                  )}
                  {isReceiptRequired && !isReceiptUploaded && (
                    <p className="flex items-center gap-1 text-[11px]">
                      • Upload Payment Receipt Screenshot for {selectedAccount.methodName}.
                    </p>
                  )}
                </div>
              )}

              {/* Dynamic Active / Disabled "Place Order" Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid && !isSubmitting
                    ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-xl hover:shadow-2xl cursor-pointer active:scale-98 animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <MessageSquareCode className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'Processing Order...'
                    : isFormValid
                    ? `Place Order (Rs. ${totalAmount.toLocaleString()})`
                    : 'Complete Details to Place Order'}
                </span>
              </button>

              <p className="text-[10.5px] text-slate-400 text-center flex items-center justify-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Instant order placement & automated receipt confirmation</span>
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
}
