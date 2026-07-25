'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Banner, Category } from '@/types';
import { Plus, Edit2, Trash2, X, UploadCloud, Clock, Image as ImageIcon } from 'lucide-react';
import { getOptimizedImageUrl, uploadToCloudinary } from '@/lib/cloudinary';

interface BannerManagerProps {
  banners: Banner[];
  categories: Category[];
  onAddBanner: (b: Omit<Banner, 'id' | 'createdAt'>) => void;
  onUpdateBanner: (b: Banner) => void;
  onDeleteBanner: (id: string) => void;
}

export const BannerManager: React.FC<BannerManagerProps> = ({
  banners,
  categories,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form state
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isForever, setIsForever] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setEditingBanner(null);
    setImage('');
    setIsActive(true);
    setIsForever(true);
    setExpiresAt('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setImage(b.image || '');
    setIsActive(b.isActive !== false);
    setIsForever(b.isForever ?? !b.expiresAt);
    setExpiresAt(b.expiresAt || '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) {
      alert('Please upload a banner image or paste an image URL.');
      return;
    }

    const payload = {
      image: image.trim(),
      isActive,
      isForever,
      expiresAt: isForever ? undefined : expiresAt,
    };

    try {
      if (editingBanner) {
        await onUpdateBanner({ ...editingBanner, ...payload });
      } else {
        await onAddBanner(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save banner:', err);
      alert('Failed to save banner to database. Please check your connection.');
    }
  };

  const checkIsExpired = (b: Banner) => {
    if (b.isForever || !b.expiresAt) return false;
    return new Date(b.expiresAt).getTime() < Date.now();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Index Storefront Banners ({banners.length})</h3>
          <p className="text-xs text-slate-500">
            Upload custom promotional banners that auto-slide on the homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Banner</span>
        </button>
      </div>

      {/* Banners Grid List */}
      {banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => {
            const isExpired = checkIsExpired(b);

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs flex flex-col ${
                  isExpired ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Banner Image Preview */}
                <div className="relative w-full h-40 bg-slate-900 overflow-hidden group">
                  <Image
                    src={getOptimizedImageUrl(b.image, 600)}
                    alt="Storefront Banner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {isExpired ? (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Expired
                      </span>
                    ) : b.isActive !== false ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Active Banner
                      </span>
                    ) : (
                      <span className="bg-slate-700 text-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] space-y-1 text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-semibold">
                          {b.isForever || !b.expiresAt
                            ? 'Never Expires (Forever)'
                            : `Expires: ${new Date(b.expiresAt).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => openEditModal(b)}
                      className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      onClick={() => onDeleteBanner(b.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Banner</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Abhi koi banner add nahi hua. Ooper button press karke naya banner add karein.</p>
        </div>
      )}

      {/* Upload / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-lg text-slate-900">
                {editingBanner ? 'Edit Storefront Banner' : 'Upload Storefront Banner'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Image Preview / Upload Box */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Image *</label>
                <div className="relative w-full h-36 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-2 overflow-hidden">
                  {image ? (
                    <>
                      <Image
                        src={getOptimizedImageUrl(image, 500)}
                        alt="Banner Preview"
                        fill
                        className="object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 space-y-1">
                      <UploadCloud className="w-6 h-6 text-brand-600" />
                      <span className="text-xs font-bold text-slate-700">Click Upload below or paste image URL</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL..."
                    className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <label className="bg-slate-900 hover:bg-black text-white px-3 py-2.5 rounded-xl cursor-pointer font-bold flex items-center gap-1.5 text-xs shrink-0 shadow-xs">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Expiration Settings */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">Banner Timing & Expiration</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="expiration"
                      checked={isForever}
                      onChange={() => setIsForever(true)}
                      className="accent-brand-600"
                    />
                    <span>Never Expires (Forever)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="expiration"
                      checked={!isForever}
                      onChange={() => setIsForever(false)}
                      className="accent-brand-600"
                    />
                    <span>Set Expiry Date</span>
                  </label>
                </div>

                {!isForever && (
                  <div className="pt-1">
                    <label className="block font-semibold text-slate-600 mb-1">Expiration Date & Time</label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium bg-white"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-brand-600 w-4 h-4 rounded"
                  />
                  <span>Banner Active on Index Storefront</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {isUploading ? 'Uploading Image...' : editingBanner ? 'Update Banner' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
