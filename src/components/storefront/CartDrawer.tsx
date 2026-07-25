'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck, MapPin, Sparkles, PiggyBank } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { STORE_LOCATION } from '@/lib/mockData';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    deliveryFee,
    totalAmount,
    totalSavings,
    applyCoupon,
    appliedCoupon,
    removeCoupon,
    amountAwayFromFreeDelivery
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const totalItemsCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-0 sm:inset-y-0 sm:right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full h-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-3.5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg">Your Cart</h3>
              <span className="bg-brand-600 text-white text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Delivery Location Note */}
          <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Delivering exclusively to <strong>{STORE_LOCATION}</strong></span>
            </div>
            <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ⚡ Express Delivery
            </span>
          </div>

          {/* Real-time Savings Banner */}
          {cart.length > 0 && totalSavings > 0 && (
            <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                  <PiggyBank className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">Adnan Super Store Special Savings</p>
                  <p className="text-xs font-black text-slate-900">
                    You are saving <span className="text-brand-700 underline font-black">Rs. {totalSavings.toLocaleString()}</span> on this order!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mb-6">Explore our fresh groceries and daily essential deals in {STORE_LOCATION}.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 sm:py-3 rounded-full shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemOriginal = item.product.originalPrice || item.product.price;
                const itemSavings = (itemOriginal - item.product.price) * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100 p-1">
                      <Image
                        src={getOptimizedImageUrl(item.product.image, 200)}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">{item.product.name}</h5>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10.5px] sm:text-[11px] font-extrabold text-slate-900">Rs. {item.product.price}</span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-[9.5px] sm:text-[10px] text-slate-400 line-through">Rs. {item.product.originalPrice}</span>
                        )}
                        <span className="text-[9.5px] sm:text-[10px] text-slate-500">/ {item.product.unit}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[11px] sm:text-xs font-black text-brand-700">
                          Total: Rs. {item.product.price * item.quantity}
                        </p>
                        {itemSavings > 0 && (
                          <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1 py-0.2 rounded">
                            Saved Rs. {itemSavings}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="text-slate-600 hover:text-red-600 p-0.5"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="text-[11px] sm:text-xs font-extrabold px-1 min-w-[14px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="text-slate-600 hover:text-brand-600 p-0.5"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-3 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-2.5 sm:space-y-4 shrink-0">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-100/80 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-brand-600" />
                      Applied: <strong>{appliedCoupon.code}</strong> (-Rs. {discount})
                    </span>
                    <button onClick={removeCoupon} className="text-red-600 hover:underline text-[11px]">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Coupon (e.g. ADNAN10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMessage && !appliedCoupon && (
                  <p className={`text-[11px] mt-1 font-semibold ${couponMessage.success ? 'text-emerald-600' : 'text-red-600'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price & Real-Time Savings Breakdown */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee ({STORE_LOCATION})</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                {/* Savings Box */}
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between bg-emerald-100/90 text-emerald-950 px-3 py-2 rounded-xl border border-emerald-200 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      Total You Saved:
                    </span>
                    <span className="text-brand-700 font-black text-sm">
                      Rs. {totalSavings.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-brand-700">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 group text-sm"
              >
                <span>Proceed to Checkout (Rs. {totalAmount.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Instant Order Placement & WhatsApp Receipt Engine
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
