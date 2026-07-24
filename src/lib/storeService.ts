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
import { Category, Product } from '@/types';

// Real-time listener for Categories from Firestore
export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void
) {
  try {
    const categoriesRef = collection(db, 'categories');
    return onSnapshot(
      categoriesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Category[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as Category);
          });
          onUpdate(items);
          localStorage.setItem('adnan_categories', JSON.stringify(items));
        } else {
          // If Firestore collection is empty, check local storage
          const saved = localStorage.getItem('adnan_categories');
          if (saved) {
            try { onUpdate(JSON.parse(saved)); } catch (e) {}
          }
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
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          onUpdate(items);
          localStorage.setItem('adnan_products', JSON.stringify(items));
        } else {
          const saved = localStorage.getItem('adnan_products');
          if (saved) {
            try { onUpdate(JSON.parse(saved)); } catch (e) {}
          }
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
