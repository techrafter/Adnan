'use client';

import React, { useState } from 'react';
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
  const { cart, subtotal, discount, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment & Receipt
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount>(MOCK_PAYMENT_ACCOUNTS[0]);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

    if (!customerName || !customerPhone || !address) {
      alert('Please fill out all required delivery fields.');
      return;
    }

    if (selectedAccount.type !== 'cod' && !receiptUrl) {
      alert('Please upload your payment screenshot receipt before confirming.');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      address,
      city: 'Shve Ada City',
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        unit: i.product.unit,
      })),
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      paymentMethod: selectedAccount.methodName,
      receiptUrl: receiptUrl || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes,
    };

    setCompletedOrder(newOrder);

    // Build pre-filled WhatsApp message URL
    const whatsappUrl = generateWhatsAppOrderUrl(newOrder);
    
    // Clear cart local state
    clearCart();
    setIsSubmitting(false);

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header onOpenSearch={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grocery Catalog</span>
        </Link>

        {completedOrder ? (
          /* Order Placed Success Screen */
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-brand-700 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Order Sent via WhatsApp!</h2>
              <p className="text-xs text-slate-500">
                Order ID: <strong className="font-mono text-brand-700">#{completedOrder.id}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-brand-700">Rs. {completedOrder.totalAmount}</span>
              </div>
              <p><strong>Deliver to:</strong> {completedOrder.address}, {completedOrder.city}</p>
              <p><strong>Payment Method:</strong> {completedOrder.paymentMethod}</p>
              {completedOrder.receiptUrl && (
                <p className="text-emerald-700 font-semibold truncate">
                  <strong>Cloudinary Receipt Link Attached</strong>
                </p>
              )}
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={generateWhatsAppOrderUrl(completedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MessageSquareCode className="w-5 h-5" />
                <span>Re-open WhatsApp Chat with Admin</span>
              </a>

              <Link
                href="/"
                className="block text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
              >
                Continue Shopping in Shve Ada Store
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Checkout Form */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Form Details */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Step 1: Address & Customer Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">1</span>
                    Customer Delivery Details
                  </h3>
                  <span className="bg-emerald-100 text-brand-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-600" /> {STORE_LOCATION} Only
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +92 300 1234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Street Address in {STORE_LOCATION}</label>
                    <textarea
                      rows={2}
                      placeholder="House/Shop #, Street name, Near landmark..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Call when outside or leave with gate guard"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Options & Account Config */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">2</span>
                  Payment Gateway Selection
                </h3>

                <PaymentGatewaySelector
                  accounts={MOCK_PAYMENT_ACCOUNTS}
                  selectedId={selectedAccount.id}
                  onSelect={setSelectedAccount}
                />
              </div>

              {/* Step 3: Cloudinary Receipt Screenshot Upload */}
              {selectedAccount.type !== 'cod' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">3</span>
                    Upload Payment Screenshot
                  </h3>

                  <ReceiptUploader
                    receiptUrl={receiptUrl}
                    onReceiptUploaded={setReceiptUrl}
                  />
                </div>
              )}

            </div>

            {/* Right Column: Order Summary & Confirm */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-24 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h3>

                {/* Items preview list */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 p-0.5">
                          <Image
                            src={getOptimizedImageUrl(item.product.image, 100)}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-bold text-slate-800 truncate">{item.product.name}</span>
                      </div>
                      <span className="font-semibold text-slate-600 text-right shrink-0">
                        x{item.quantity} = Rs. {item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Costs breakdown */}
                <div className="pt-4 border-t border-slate-200 text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">Rs. {subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>- Rs. {discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee ({STORE_LOCATION})</span>
                    <span className="font-semibold text-slate-800">
                      {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-brand-700">Rs. {totalAmount}</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 text-sm mt-4"
                >
                  <MessageSquareCode className="w-5 h-5" />
                  <span>Confirm Order via WhatsApp</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pre-filled order payload sent directly to Store Admin
                </p>

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
