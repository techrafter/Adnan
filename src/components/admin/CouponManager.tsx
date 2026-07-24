'use client';

import React, { useState } from 'react';
import { Coupon } from '@/types';
import { Plus, Tag, Trash2, CheckCircle, Percent, DollarSign } from 'lucide-react';

interface CouponManagerProps {
  coupons: Coupon[];
  onSaveCoupons: (c: Coupon[]) => void;
}

export const CouponManager: React.FC<CouponManagerProps> = ({ coupons, onSaveCoupons }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [type, setType] = useState<Coupon['type']>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleToggle = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    onSaveCoupons(updated);
  };

  const handleDelete = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    onSaveCoupons(updated);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value,
      minOrderAmount,
      expiryDate,
      isActive: true,
    };
    onSaveCoupons([...coupons, newCoupon]);
    setIsModalOpen(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h4 className="font-bold text-lg text-slate-900">Discount Coupons & Offers</h4>
          <p className="text-xs text-slate-500">Create promotional codes for store customers in Shve Ada City.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coupons.map((cp) => (
          <div
            key={cp.id}
            className={`p-4 rounded-2xl border-2 transition-all space-y-2 relative ${
              cp.isActive ? 'bg-white border-emerald-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-sm text-brand-700 bg-emerald-100/70 px-3 py-1 rounded-xl flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {cp.code}
              </span>
              <button
                onClick={() => handleDelete(cp.id)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1 text-slate-700 pt-1">
              <p className="font-bold text-slate-900 text-sm">
                Discount: {cp.type === 'percentage' ? `${cp.value}% OFF` : `Flat Rs. ${cp.value} OFF`}
              </p>
              <p className="text-slate-500">Min Order: Rs. {cp.minOrderAmount}</p>
              <p className="text-slate-400 text-[11px]">Expires: {cp.expiryDate}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Status</span>
              <button
                onClick={() => handleToggle(cp.id)}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  cp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {cp.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Create Discount Coupon
            </h4>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. ADNAN20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl uppercase font-mono font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minimum Order (Rs)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 text-white rounded-xl font-extrabold shadow-sm"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
