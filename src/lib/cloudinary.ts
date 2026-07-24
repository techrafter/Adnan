/**
 * Cloudinary image optimization & direct upload helper
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

// Upload image file directly to Cloudinary via unsigned upload preset
export async function uploadToCloudinary(file: File): Promise<string> {
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
    console.warn('Cloudinary API error, using reader preview:', error);
  }

  // Fallback data URL reader for instant preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
}
