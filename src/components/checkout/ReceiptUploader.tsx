'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadToCloudinary, getOptimizedImageUrl } from '@/lib/cloudinary';

interface ReceiptUploaderProps {
  onReceiptUploaded: (url: string) => void;
  receiptUrl: string;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onReceiptUploaded, receiptUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image screenshot (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadToCloudinary(file);
      onReceiptUploaded(url);
    } catch (err) {
      console.error('Upload failed', err);
      setError('Failed to upload receipt screenshot. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
        Upload Payment Receipt Screenshot
      </label>

      {receiptUrl ? (
        <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-300 shrink-0 bg-white">
              <Image
                src={getOptimizedImageUrl(receiptUrl, 300)}
                alt="Payment Receipt Screenshot"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Receipt Uploaded to Cloudinary</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                Auto-compressed (f_auto, q_auto)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onReceiptUploaded('')}
            className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-white transition-colors"
            title="Remove screenshot"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isUploading ? 'bg-slate-50 border-brand-400' : 'bg-slate-50/50 hover:bg-slate-100 border-slate-300 hover:border-brand-500'
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-brand-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Uploading & Optimizing Screenshot...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-emerald-100 text-brand-700 rounded-full flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to upload EasyPaisa / JazzCash / Bank Screenshot
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports PNG, JPG, WebP (Cloudinary Auto-Format & Compress)
              </p>
            </>
          )}
        </label>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
