import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { Category, Product, Banner, SiteSettings } from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: '',
  storeName: 'ADNAN SUPER STORE',
  tagline: 'Quality You Trust, Prices You Love',
  phone: '0300 1234567',
  announcementText: '',
};

// Real-time listener for Site Settings from Firestore with multi-endpoint redundancy
export function subscribeToSiteSettings(
  onUpdate: (settings: SiteSettings) => void
) {
  let activeSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

  const handleUpdate = (data: any) => {
    if (data && typeof data === 'object') {
      const merged = { ...DEFAULT_SITE_SETTINGS, ...activeSettings, ...data };
      activeSettings = merged;
      onUpdate(merged);
    }
  };

  try {
    const unsub1 = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) handleUpdate(snap.data());
    }, (err) => console.warn('settings/site listener notice:', err));

    const unsub2 = onSnapshot(doc(db, 'site_settings', 'main'), (snap) => {
      if (snap.exists()) handleUpdate(snap.data());
    }, (err) => console.warn('site_settings/main listener notice:', err));

    const unsub3 = onSnapshot(doc(db, 'banners', 'site_logo_config'), (snap) => {
      if (snap.exists()) handleUpdate(snap.data());
    }, (err) => console.warn('banners/site_logo_config listener notice:', err));

    return () => {
      try { unsub1(); } catch (e) {}
      try { unsub2(); } catch (e) {}
      try { unsub3(); } catch (e) {}
    };
  } catch (e) {
    console.warn('Firestore subscription failed for site settings:', e);
    return () => {};
  }
}

// Real-time listener for Banners from Firestore
export function subscribeToBanners(
  onUpdate: (banners: Banner[]) => void
) {
  try {
    const bannersRef = collection(db, 'banners');
    return onSnapshot(
      bannersRef,
      (snapshot) => {
        const items: Banner[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Banner);
        });
        onUpdate(items);
        if (items.length > 0) {
          localStorage.setItem('adnan_banners', JSON.stringify(items));
        }
      },
      (error) => {
        console.warn('Banners Firestore listener notice:', error);
      }
    );
  } catch (e) {
    console.warn('Firestore subscription failed for banners:', e);
    return () => {};
  }
}

// Real-time listener for Categories from Firestore
export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void
) {
  try {
    const categoriesRef = collection(db, 'categories');
    return onSnapshot(
      categoriesRef,
      (snapshot) => {
        const items: Category[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Category);
        });
        onUpdate(items);
        if (items.length > 0) {
          localStorage.setItem('adnan_categories', JSON.stringify(items));
        }
      },
      (error) => {
        console.warn('Categories Firestore listener notice:', error);
      }
    );
  } catch (e) {
    console.warn('Firestore subscription failed for categories:', e);
    return () => {};
  }
}

// Real-time listener for Products from Firestore
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void
) {
  try {
    const productsRef = collection(db, 'products');
    return onSnapshot(
      productsRef,
      (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        onUpdate(items);
        if (items.length > 0) {
          localStorage.setItem('adnan_products', JSON.stringify(items));
        }
      },
      (error) => {
        console.warn('Products Firestore listener notice:', error);
      }
    );
  } catch (e) {
    console.warn('Firestore subscription failed for products:', e);
    return () => {};
  }
}

// Save Category to Firestore
export async function saveCategoryToFirestore(category: Category) {
  try {
    await setDoc(doc(db, 'categories', category.id), category, { merge: true });
  } catch (e) {
    console.warn('Saved category locally:', e);
  }
}

// Delete Category from Firestore
export async function deleteCategoryFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (e) {
    console.warn('Deleted category locally:', e);
  }
}

// Save Product to Firestore
export async function saveProductToFirestore(product: Product) {
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
  } catch (e) {
    console.warn('Saved product locally:', e);
  }
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (e) {
    console.warn('Deleted product locally:', e);
  }
}

// Helper to strip undefined values before Firestore operations
function sanitizeFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      clean[key] = data[key];
    }
  });
  return clean;
}

// Save Banner to Firestore
export async function saveBannerToFirestore(banner: Banner) {
  try {
    const cleanData = sanitizeFirestoreData(banner);
    await setDoc(doc(db, 'banners', banner.id), cleanData, { merge: true });
  } catch (e) {
    console.warn('Firestore banner save notice:', e);
  }
}

// Delete Banner from Firestore
export async function deleteBannerFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (e) {
    console.warn('Firestore banner delete notice:', e);
  }
}

// Save Site Settings to Firestore across redundant endpoints to guarantee cross-device sync
export async function saveSiteSettingsToFirestore(settings: SiteSettings) {
  const cleanData = sanitizeFirestoreData({
    ...settings,
    updatedAt: new Date().toISOString()
  });

  const targets = [
    doc(db, 'settings', 'site'),
    doc(db, 'site_settings', 'main'),
    doc(db, 'banners', 'site_logo_config')
  ];

  await Promise.allSettled(
    targets.map((targetRef) =>
      setDoc(targetRef, cleanData, { merge: true }).catch((err) => {
        console.warn(`Firestore save notice for ${targetRef.path}:`, err);
      })
    )
  );
}

