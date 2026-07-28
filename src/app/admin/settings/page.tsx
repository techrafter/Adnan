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
  Sliders,
  Eye
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useCatalog();

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (siteSettings?.logoUrl) {
      setLogoUrl(siteSettings.logoUrl);
    }
  }, [siteSettings]);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, WebP, or JPG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File size exceeds 2MB limit. Please upload an optimized PNG under 200KB for maximum page speed.');
    } else {
      setErrorMessage('');
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setLogoUrl(uploadedUrl);
        setSuccessMessage('Logo uploaded successfully! Click "Save Logo Settings" below to apply.');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setErrorMessage('An error occurred while uploading the logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Reset Logo to Default
  const handleResetLogo = () => {
    setLogoUrl('');
    setSuccessMessage('Logo cleared. Click "Save Logo Settings" to apply.');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateSiteSettings({
        logoUrl: logoUrl.trim()
      });
      setSuccessMessage('🎉 Website Logo successfully saved and updated across the entire website!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Save settings error:', err);
      setErrorMessage('Failed to save settings. Please try again.');
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
            Website Logo Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Upload and manage the primary brand logo displayed at the top header and footer of your website.
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
              <span>Recommended Logo Specifications</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white mb-4">
              Logo Size & Performance Guidelines
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">Recommended Dimensions</span>
                <span className="text-base font-extrabold text-white">500 x 200 px</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(Aspect Ratio 2.5:1 to 3:1)</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">File Format</span>
                <span className="text-base font-extrabold text-white">PNG / WebP</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(Transparent Background)</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">Max File Size</span>
                <span className="text-base font-extrabold text-white">Under 200 KB</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">(Instant Load Speed)</span>
              </div>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent PNG files blend seamlessly with light header navigation backgrounds.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cloudinary CDN & local browser caching deliver instant logo load times without flashing.</span>
              </li>
            </ul>
          </div>

          {/* LOGO UPLOAD & MANAGEMENT CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Store Logo</h3>
                <p className="text-xs text-slate-500">Choose a PNG or WebP image file for your website header</p>
              </div>
              <button
                type="button"
                onClick={handleResetLogo}
                className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
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
                    {isUploading ? 'Uploading Image...' : 'Click or Drag PNG Logo Here'}
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
                placeholder="https://example.com/logo.png or /logo.png"
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE HEADER MOCK PREVIEW & SAVE BUTTON (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">

          {/* LIVE HEADER PREVIEW CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">Header Preview</h3>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Live Storefront Mock
              </span>
            </div>

            {/* MOCK HEADER CONTAINER */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-center border-b border-slate-800 pb-1.5">
                Header Bar Preview
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
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
                      A
                    </div>
                  )}
                </div>

                <div className="flex-1 max-w-[120px] bg-slate-100 h-7 rounded-full border border-slate-200 flex items-center px-2 text-[9px] text-slate-400">
                  Search...
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              💡 <strong>Tip:</strong> Saving your logo updates the brand image across all customer pages instantly.
            </p>
          </div>

          {/* SAVE BUTTON CARD */}
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Apply Changes</h3>
              <p className="text-xs text-slate-500">Save updated logo to live website</p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Saving Logo...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Logo Settings</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
