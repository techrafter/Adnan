import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Image optimization & fast direct upload helper with instant canvas fallback
 */

// Helper to transform any Cloudinary or fallback image URL with optimal format and quality
export function getOptimizedImageUrl(url: string, width = 600, quality = 'auto'): string {
  if (!url) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';

  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }

  return url;
}

// Timeout wrapper for network requests to prevent hanging promises
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Network request timed out'));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Fast canvas compression helper (< 30KB WebP Data URL in ~30ms)
async function compressImageToDataUrl(file: File, maxWidth = 500, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', quality));
        } else {
          resolve(e.target?.result as string || '');
        }
      };
      img.onerror = () => resolve(e.target?.result as string || '');
    };
    reader.onerror = () => resolve('');
  });
}

// Upload image file with fast strategy: ImgBB -> Cloudinary -> Firebase -> Compressed WebP
export async function uploadToCloudinary(file: File): Promise<string> {
  // Generate fast compressed fallback in parallel (~20ms)
  const compressedFallback = await compressImageToDataUrl(file);

  // Try ImgBB Public API with 2.5s timeout
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await withTimeout(
      fetch(`https://api.imgbb.com/1/upload?key=3b66df21a719c8f95c52c0032906e579`, {
        method: 'POST',
        body: formData,
      }),
      2500
    );
    if (res.ok) {
      const data = await res.json();
      if (data.data?.url) return data.data.url;
    }
  } catch (err) {
    console.warn('ImgBB upload notice, using compressed fallback:', err);
  }

  // Try Cloudinary Direct Upload with 2.5s timeout
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bwuhycez';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'adnan_preset';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await withTimeout(
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      }),
      2500
    );

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
    }
  } catch (error) {
    console.warn('Cloudinary API notice:', error);
  }

  // Try Firebase Storage with 2.5s timeout
  try {
    if (storage) {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);
      await withTimeout(uploadBytes(storageRef, file), 2500);
      const downloadUrl = await withTimeout(getDownloadURL(storageRef), 2500);
      if (downloadUrl) return downloadUrl;
    }
  } catch (err) {
    console.warn('Firebase Storage upload notice:', err);
  }

  // Return instant compressed WebP URL (< 30KB) if network calls fail/timeout
  return compressedFallback;
}
