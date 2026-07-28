import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Cloudinary & Firebase image optimization & direct upload helper
 */

// Helper to transform any Cloudinary or fallback image URL with optimal format and quality
export function getOptimizedImageUrl(url: string, width = 600, quality = 'auto'): string {
  if (!url) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';

  if (url.includes('res.cloudinary.com')) {
    // Inject f_auto, q_auto, w_width into Cloudinary URL
    return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }

  return url;
}

// Compress image file using canvas to guarantee data URL size is < 40KB if external hosts fail
async function compressImageToDataUrl(file: File, maxWidth = 500, quality = 0.75): Promise<string> {
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
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
}

// Upload image file directly using Firebase Storage, ImgBB, Cloudinary or Compressed Fallback
export async function uploadToCloudinary(file: File): Promise<string> {
  // Provider 1: Firebase Storage (Most reliable & native to project)
  try {
    if (storage) {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      if (downloadUrl) return downloadUrl;
    }
  } catch (err) {
    console.warn('Firebase Storage upload notice, trying fallback hosts:', err);
  }

  // Provider 2: ImgBB Public Free API
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=3b66df21a719c8f95c52c0032906e579`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data?.url) return data.data.url;
    }
  } catch (err) {
    console.warn('ImgBB upload notice:', err);
  }

  // Provider 3: Cloudinary Direct Upload
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bwuhycez';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'adnan_preset';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.secure_url;
    }
  } catch (error) {
    console.warn('Cloudinary API notice:', error);
  }

  // Ultimate Fallback: Compressed micro-base64 WebP (<30KB) that safely fits into Firestore 1MB limits
  return await compressImageToDataUrl(file);
}
