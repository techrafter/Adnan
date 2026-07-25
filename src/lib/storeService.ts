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
import { Category, Product, Banner } from '@/types';

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
