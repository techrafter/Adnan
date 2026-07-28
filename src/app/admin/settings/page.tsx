'use client';

import React, { useState, useEffect } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  Loader2,
  Sparkles,
  Eye,
  Link2
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

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setLogoUrl(uploadedUrl);
        setSuccessMessage('Logo uploaded successfully! Click "Apply & Save Logo" below to publish.');
      } else {
        setErrorMessage('Could not upload image. Please try another file.');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setErrorMessage('An error occurred while uploading the logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove Logo
  const handleRemoveLogo = () => {
    setLogoUrl('');
    setSuccessMessage('Logo cleared. Click "Apply & Save Logo" to update your website.');
  };

  // Save Settings to Database
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateSiteSettings({
        logoUrl: logoUrl.trim()
      });
      setSuccessMessage('🎉 Logo successfully updated across all browsers and devices!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Save settings error:', err);
      setErrorMessage('Failed to save settings to database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 antialiased">
      
      {/* PAGE HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Store Brand Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Website Logo Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Upload your brand logo. It will appear at the top header of your website globally.
          </p>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-md flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* MAIN CARD */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
        
        {/* SECTION 1: UPLOAD BOX */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-600" />
              <span>1. Choose Store Logo</span>
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Logo</span>
              </button>
            )}
          </div>

          <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-3xl p-6 sm:p-10 text-center bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-brand-600" />
                )}
              </div>

              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {isUploading ? 'Uploading Logo...' : 'Click or Drag Logo Image Here'}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  PNG, WebP, or JPG (Recommended: Transparent PNG, 500x200px)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE HEADER PREVIEW */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>2. Live Top Header Preview</span>
          </label>

          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Website Top Navigation Bar
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              {/* LOGO SLOT */}
              <div className="w-[140px] sm:w-[200px] h-10 flex items-center justify-start border border-dashed border-slate-200 rounded-lg p-1 bg-slate-50">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-8 sm:h-9 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 italic">No Logo Set</span>
                )}
              </div>

              {/* SEARCH MOCK */}
              <div className="flex-1 max-w-[200px] bg-slate-100 h-8 rounded-full border border-slate-200 flex items-center px-3 text-xs text-slate-400">
                Search products...
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DIRECT IMAGE URL (OPTIONAL) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Direct Image Link (Optional)</span>
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        {/* SECTION 4: SAVE BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Applying Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Apply & Save Logo</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
