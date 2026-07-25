'use client';

import React, { useState, useEffect } from 'react';
import { CouponManager } from '@/components/admin/CouponManager';
import { Coupon } from '@/types';
import { MOCK_COUPONS } from '@/lib/mockData';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);

  useEffect(() => {
    const saved = localStorage.getItem('adnan_coupons');
    if (saved) {
      try { setCoupons(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSaveCoupons = (updated: Coupon[]) => {
    setCoupons(updated);
    localStorage.setItem('adnan_coupons', JSON.stringify(updated));
  };

  return (
    <CouponManager
      coupons={coupons}
      onSaveCoupons={handleSaveCoupons}
    />
  );
}
