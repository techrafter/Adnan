'use client';

import React from 'react';
import { PaymentAccount } from '@/types';
import { CreditCard, Smartphone, Banknote, Building2, CheckCircle2 } from 'lucide-react';

interface PaymentGatewaySelectorProps {
  accounts: PaymentAccount[];
  selectedId: string;
  onSelect: (account: PaymentAccount) => void;
}

export const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  accounts,
  selectedId,
  onSelect,
}) => {
  const activeAccounts = accounts.filter((acc) => acc.isActive);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
        Select Payment Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeAccounts.map((account) => {
          const isSelected = selectedId === account.id;

          const getIcon = () => {
            if (account.methodName.toLowerCase().includes('easypaisa')) return <Smartphone className="w-5 h-5 text-brand-600" />;
            if (account.methodName.toLowerCase().includes('jazzcash')) return <Smartphone className="w-5 h-5 text-red-600" />;
            if (account.type === 'bank_transfer') return <Building2 className="w-5 h-5 text-blue-600" />;
            return <Banknote className="w-5 h-5 text-accent-500" />;
          };

          return (
            <div
              key={account.id}
              onClick={() => onSelect(account)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? 'bg-brand-50/80 border-brand-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                    {getIcon()}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{account.methodName}</h5>
                    <p className="text-[11px] text-slate-500">{account.accountTitle}</p>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                )}
              </div>

              {/* Account details accordion */}
              {isSelected && account.type !== 'cod' && (
                <div className="mt-3 pt-3 border-t border-brand-200/60 text-xs space-y-1 text-slate-700 bg-white/70 p-2.5 rounded-xl">
                  <p className="font-mono font-bold text-slate-900">
                    Number / Account #: <span className="bg-brand-100 text-brand-900 px-1.5 py-0.5 rounded">{account.accountNumber}</span>
                  </p>
                  {account.iban && (
                    <p className="font-mono text-[11px] text-slate-600">
                      IBAN: {account.iban}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    "{account.instructions}"
                  </p>
                </div>
              )}

              {isSelected && account.type === 'cod' && (
                <div className="mt-2 text-[11px] text-slate-600 italic">
                  Pay cash directly to the delivery rider upon receiving your package in Shve Ada City.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
