'use client';

import React, { useState, useEffect } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Globe,
  Phone,
  Store,
  Sliders,
  Eye,
  Info
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useCatalog();

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (siteSettings) {
      setLogoUrl(siteSettings.logoUrl || '/logo.png');
      setStoreName(siteSettings.storeName || 'ADNAN SUPER STORE');
      setTagline(siteSettings.tagline || 'Quality You Trust, Prices You Love');
      setPhone(siteSettings.phone || '0300 1234567');
    }
  }, [siteSettings]);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Khabardar! Sirf PNG, JPG, ya WebP image upload karein.');
      return;
    }

    // Size warning (2MB check for raw upload, recommended < 200KB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size 2MB se ziada hai. Please fast loading ke liye choti PNG file upload karein.');
    } else {
      setErrorMessage('');
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setLogoUrl(uploadedUrl);
        setSuccessMessage('Logo photo select ho gayi hai! Neechay "Save Settings" button dabayein.');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setErrorMessage('Logo upload mein koi masala aya. Dibara koshish karein.');
    } finally {
      setIsUploading(false);
    }
  };

  // Reset Logo to Default
  const handleResetLogo = () => {
    setLogoUrl('/logo.png');
    setSuccessMessage('Default logo reset ho gaya hai! Save button dabayein.');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateSiteSettings({
        logoUrl: logoUrl.trim() || '/logo.png',
        storeName: storeName.trim() || 'ADNAN SUPER STORE',
        tagline: tagline.trim() || 'Quality You Trust, Prices You Love',
        phone: phone.trim() || '0300 1234567'
      });
      setSuccessMessage('🎉 Website Settings & Logo Successfully Save Ho Gaye Hain!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Save settings error:', err);
      setErrorMessage('Settings save karne mein error aya.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 antialiased">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-brand-600 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Store Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Website Settings & Logo System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Apni website ka top logo upload karein aur store ki main branding details customize karein.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-2xl border border-emerald-200 shrink-0">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-bounce" />
          <span className="text-xs font-extrabold">Ultra-Fast Load System</span>
        </div>
      </div>

      {/* NOTIFICATION MESSAGES */}
      {successMessage && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: LOGO UPLOAD & SPECIFICATIONS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">

          {/* RECOMMENDED LOGO DIMENSIONS & GUIDANCE BOX */}
          <div className="bg-gradient-to-br from-brand-900 via-brand-850 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5 text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Logo Dimensions & Guidelines</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white mb-4">
              Logo Size & Fast Loading Instructions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">Ideal Dimensions</span>
                <span className="text-base font-extrabold text-white">500 x 200 px</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(Aspect Ratio 2.5:1)</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">File Format</span>
                <span className="text-base font-extrabold text-white">PNG / WebP</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(Transparent Background)</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">Max File Size</span>
                <span className="text-base font-extrabold text-white">Under 200 KB</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(For 0ms Ultra-Fast Load)</span>
              </div>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent PNG background header border ke sath perfectly blend hoti hai.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Website speed optimized hai - Cloudinary aur local cache se logo instant load hoga.</span>
              </li>
            </ul>
          </div>

          {/* LOGO UPLOAD & MANAGEMENT CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Store Logo</h3>
                <p className="text-xs text-slate-500">Website ke top header ke liye PNG file upload karein</p>
              </div>
              <button
                type="button"
                onClick={handleResetLogo}
                className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* UPLOAD DROPZONE */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all group cursor-pointer">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {isUploading ? (
                    <Zap className="w-7 h-7 text-brand-600 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7 text-brand-600" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-black text-slate-800">
                    {isUploading ? 'Uploading Logo Image...' : 'Click or Drag PNG Logo Here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports PNG, WebP, JPG (Recommended width: 500px - 600px)
                  </p>
                </div>
              </div>
            </div>

            {/* DIRECT URL INPUT OPTION */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-black text-slate-700 block">
                Direct Image Link / URL (Optional)
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png ya /logo.png"
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE HEADER MOCK PREVIEW & STORE INFO FORM (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">

          {/* LIVE HEADER PREVIEW CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">Live Top Header Preview</h3>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Exact Website Mock
              </span>
            </div>

            {/* MOCK HEADER CONTAINER */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-center border-b border-slate-800 pb-1.5">
                Top Announcement Bar Preview
              </div>

              {/* LOGO AREA MOCK */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2 max-w-[190px] overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Store Logo Preview"
                      className="h-10 w-auto object-contain max-w-[180px]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className={`flex items-center gap-1.5 ${logoUrl ? 'hidden' : ''}`}>
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                      {(storeName || 'A').charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-xs text-slate-900 leading-none">
                        {storeName || 'ADNAN SUPER STORE'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-[120px] bg-slate-100 h-7 rounded-full border border-slate-200 flex items-center px-2 text-[9px] text-slate-400">
                  Search...
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              💡 <strong>Tip:</strong> Logo upload karne ke baad yeh aapki live website par sab se upar header mein bilkul aisi look dega.
            </p>
          </div>

          {/* STORE INFORMATION FORM */}
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Store Information</h3>
              <p className="text-xs text-slate-500">Website title aur contact details</p>
            </div>

            {/* Store Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-brand-600" />
                <span>Store Name</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. ADNAN SUPER STORE"
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-extrabold"
              />
            </div>

            {/* Tagline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Store Tagline / Slogan</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Quality You Trust, Prices You Love"
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>Contact / WhatsApp Phone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300 1234567"
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-bold"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Website Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
