'use client';

import React, { useState, useEffect } from 'react';
import { PaymentConfigManager } from '@/components/admin/PaymentConfigManager';
import { PaymentAccount } from '@/types';
import { MOCK_PAYMENT_ACCOUNTS } from '@/lib/mockData';

export default function AdminPaymentsPage() {
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(MOCK_PAYMENT_ACCOUNTS);

  useEffect(() => {
    const saved = localStorage.getItem('adnan_payment_accounts');
    if (saved) {
      try { setPaymentAccounts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSaveAccounts = (accounts: PaymentAccount[]) => {
    setPaymentAccounts(accounts);
    localStorage.setItem('adnan_payment_accounts', JSON.stringify(accounts));
  };

  return (
    <PaymentConfigManager
      accounts={paymentAccounts}
      onSaveAccounts={handleSaveAccounts}
    />
  );
}
