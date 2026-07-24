'use client';

import React, { useState } from 'react';
import { PaymentAccount } from '@/types';
import { Plus, Edit2, Trash2, CheckCircle, Smartphone, Building2, Banknote } from 'lucide-react';

interface PaymentConfigManagerProps {
  accounts: PaymentAccount[];
  onSaveAccounts: (accounts: PaymentAccount[]) => void;
}

export const PaymentConfigManager: React.FC<PaymentConfigManagerProps> = ({ accounts, onSaveAccounts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [methodName, setMethodName] = useState('');
  const [type, setType] = useState<PaymentAccount['type']>('mobile_wallet');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [instructions, setInstructions] = useState('');

  const openAddForm = () => {
    setEditingId('new');
    setMethodName('New Payment Gateway');
    setType('mobile_wallet');
    setAccountTitle('Adnan Super Store');
    setAccountNumber('03000000000');
    setIban('');
    setInstructions('Please send exact payment and upload transfer receipt screenshot.');
  };

  const openEditForm = (acc: PaymentAccount) => {
    setEditingId(acc.id);
    setMethodName(acc.methodName);
    setType(acc.type);
    setAccountTitle(acc.accountTitle);
    setAccountNumber(acc.accountNumber);
    setIban(acc.iban || '');
    setInstructions(acc.instructions);
  };

  const handleToggleActive = (id: string) => {
    const updated = accounts.map((acc) =>
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    );
    onSaveAccounts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = accounts.filter((acc) => acc.id !== id);
    onSaveAccounts(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === 'new') {
      const newAcc: PaymentAccount = {
        id: `pa-${Date.now()}`,
        methodName,
        type,
        accountTitle,
        accountNumber,
        iban,
        instructions,
        isActive: true,
      };
      onSaveAccounts([...accounts, newAcc]);
    } else if (editingId) {
      const updated = accounts.map((acc) =>
        acc.id === editingId
          ? { ...acc, methodName, type, accountTitle, accountNumber, iban, instructions }
          : acc
      );
      onSaveAccounts(updated);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h4 className="font-bold text-lg text-slate-900">Dynamic Payment Setup</h4>
          <p className="text-xs text-slate-500">Configure bank accounts and mobile wallet details shown at customer checkout.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
              acc.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {acc.type === 'mobile_wallet' ? (
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                ) : acc.type === 'bank_transfer' ? (
                  <Building2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <Banknote className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900">{acc.methodName}</h5>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{acc.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acc.isActive}
                    onChange={() => handleToggleActive(acc.id)}
                    className="accent-brand-600"
                  />
                  <span>Active</span>
                </label>

                <button
                  onClick={() => openEditForm(acc)}
                  className="p-1 text-slate-500 hover:text-brand-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl">
              <p><strong>Account Title:</strong> {acc.accountTitle}</p>
              <p className="font-mono"><strong>Number / Acc #:</strong> {acc.accountNumber}</p>
              {acc.iban && <p className="font-mono"><strong>IBAN:</strong> {acc.iban}</p>}
              <p className="text-slate-500 italic mt-1 font-serif">"{acc.instructions}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              {editingId === 'new' ? 'Add Payment Gateway' : 'Edit Payment Account'}
            </h4>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Method Name</label>
                <input
                  type="text"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  placeholder="e.g. EasyPaisa, JazzCash, Meezan Bank"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="mobile_wallet">Mobile Wallet (EasyPaisa / JazzCash)</option>
                  <option value="bank_transfer">Bank IBFT Transfer</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Title</label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number / Mobile Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              {type === 'bank_transfer' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IBAN Number</label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="e.g. PK36MEZN0001020304050607"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Transfer Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 text-white rounded-xl font-extrabold shadow-sm"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
