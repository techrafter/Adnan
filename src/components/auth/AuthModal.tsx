'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, Phone, MapPin, User as UserIcon, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    onboardingOpen, 
    setOnboardingOpen, 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail, 
    loginDemoUser, 
    updateProfileData 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Shve Ada City');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen && !onboardingOpen) return null;

  // Onboarding submit for missing phone or address
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) {
      setErrorMsg('Please enter both your phone number and delivery address.');
      return;
    }
    setLoading(true);
    try {
      await updateProfileData({
        name: name || user?.name || 'Customer',
        phone,
        address,
        city: city || 'Shve Ada City',
        addresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Home',
            address,
            city: city || 'Shve Ada City',
            isDefault: true
          }
        ]
      });
      setOnboardingOpen(false);
      onClose();
    } catch (err: any) {
      setErrorMsg('Failed to update details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        onClose();
      } else {
        await signUpWithEmail(email, password, name, phone, address);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      if (user?.phone && user?.address) {
        onClose();
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMsg(err.message || 'Google Sign-In failed. Please verify Firebase settings.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = (isAdmin: boolean) => {
    if (isAdmin) {
      loginDemoUser('Admin Storekeeper', '+923348699487', true);
    } else {
      loginDemoUser('Ali Raza', '+923001234567', false);
    }
    onClose();
  };

  // If onboarding is triggered
  if (onboardingOpen && user) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-emerald-100 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Complete Your Store Profile</h3>
              <p className="text-xs text-slate-500">Welcome {user.name}! Please provide delivery details for fast shipping in Shve Ada City.</p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name || user.name || ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Used for order status & delivery updates via WhatsApp.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Default Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Shop #, Street, Area"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 text-brand-900 rounded-xl text-sm font-semibold cursor-not-allowed"
                readOnly
              />
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">⚡ Direct local fast delivery exclusive to Shve Ada City</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Complete Profile</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <span className="text-[10px] font-extrabold tracking-widest text-brand-600 uppercase">Adnan Super Store</span>
          <h2 className="text-2xl font-black text-slate-900">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to track orders, save shipping addresses & fast checkout.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Primary Google Auth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 group mb-4 active:scale-98 disabled:opacity-80"
        >
          {googleLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Connecting to Google OAuth...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">Or Email Auth</span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali Raza"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street name, Shve Ada City"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all active:scale-98"
          >
            {mode === 'signin' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
          </button>
        </div>

        {/* Quick Demo Credentials Switch */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Quick Demo Access:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin(false)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-[11px]"
            >
              Customer
            </button>
            <button
              onClick={() => handleDemoLogin(true)}
              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg transition-colors text-[11px]"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
