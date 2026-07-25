'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address } from '@/types';
import { auth, db, googleProvider } from '@/lib/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string, address: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  triggerPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous cache read on mount so logged-in user is populated instantly (0ms flash)
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('adnan_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && typeof parsed === 'object' && parsed.uid) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached adnan_user:', e);
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Sync auth state with Firebase Auth & Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            const fullProfile: UserProfile = {
              ...data,
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || data.name || 'Customer',
              email: firebaseUser.email || data.email,
              photoURL: firebaseUser.photoURL || data.photoURL,
              // Admin role strictly driven by Firestore database field isAdmin == true
              isAdmin: Boolean(data.isAdmin)
            };

            setUser(fullProfile);
            try { localStorage.setItem('adnan_user', JSON.stringify(fullProfile)); } catch (e) {}

            if (!data.phone || !data.address) {
              setOnboardingOpen(true);
            }
          } else {
            // New user profile initialization (Default isAdmin is ALWAYS false)
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Customer',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              address: '',
              city: 'Shve Ada City',
              photoURL: firebaseUser.photoURL || '',
              isAdmin: false, // Strict: Regular signups are never Admin
              isBanned: false,
              createdAt: new Date().toISOString(),
              totalOrders: 0,
              addresses: []
            };

            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
            try { localStorage.setItem('adnan_user', JSON.stringify(newProfile)); } catch (e) {}
            setOnboardingOpen(true);
          }
        } catch (e) {
          console.warn('Firestore connection fallback active:', e);
          const savedUser = localStorage.getItem('adnan_user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              // Keep existing state
            }
          }
        }
      } else {
        setUser(null);
        try { localStorage.removeItem('adnan_user'); } catch (e) {}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('Popup blocked or closed, attempting redirect mode...');
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupError;
      }

      const fbUser = result.user;
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || 'Google Customer',
          email: fbUser.email || '',
          phone: '',
          address: '',
          city: 'Shve Ada City',
          photoURL: fbUser.photoURL || '',
          isAdmin: false, // Strict: Regular signups are never Admin
          isBanned: false,
          createdAt: new Date().toISOString(),
          totalOrders: 0,
          addresses: []
        };
        await setDoc(userDocRef, newProfile);
        setUser(newProfile);
        setOnboardingOpen(true);
      } else {
        const existingData = userSnap.data() as UserProfile;
        const updatedUser = {
          ...existingData,
          name: fbUser.displayName || existingData.name,
          email: fbUser.email || existingData.email,
          photoURL: fbUser.photoURL || existingData.photoURL,
          isAdmin: Boolean(existingData.isAdmin)
        };
        setUser(updatedUser);
        if (!existingData.phone || !existingData.address) {
          setOnboardingOpen(true);
        }
      }
    } catch (error: any) {
      console.error('Firebase Google Sign-In error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is disabled in Firebase Console. Please enable Google under Authentication > Sign-in method.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized in Firebase Console. Add your domain under Authentication > Settings > Authorized domains.');
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error('Invalid Firebase API key in environment variables.');
      } else {
        throw new Error(error.message || 'Google Sign-In failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Firebase Email sign in error:', error.message);
      throw new Error(error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string, address: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      
      const newProfile: UserProfile = {
        uid: res.user.uid,
        name,
        email,
        phone,
        address,
        city: 'Shve Ada City',
        isAdmin: false, // Strict: Regular signups are never Admin
        isBanned: false,
        createdAt: new Date().toISOString(),
        totalOrders: 0,
        addresses: [
          { id: 'addr-1', label: 'Home', address, city: 'Shve Ada City', isDefault: true }
        ]
      };

      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUser(newProfile);
    } catch (error: any) {
      console.error('Email sign up error:', error);
      throw new Error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    localStorage.removeItem('adnan_user');
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    // Strip isAdmin from data updates to prevent client-side elevation
    const { isAdmin, ...safeData } = data;
    const updated = { ...user, ...safeData };
    setUser(updated);
    localStorage.setItem('adnan_user', JSON.stringify(updated));

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, safeData);
    } catch (e) {
      console.warn('Firestore profile update fallback:', e);
    }
  };

  const addAddress = async (newAddr: Address) => {
    if (!user) return;
    const currentAddresses = user.addresses || [];
    const updatedAddresses = [...currentAddresses, newAddr];
    await updateProfileData({ addresses: updatedAddresses });
  };

  const removeAddress = async (addressId: string) => {
    if (!user) return;
    const currentAddresses = user.addresses || [];
    const updatedAddresses = currentAddresses.filter(a => a.id !== addressId);
    await updateProfileData({ addresses: updatedAddresses });
  };

  const triggerPasswordReset = async (email: string) => {
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.warn('Password reset trigger error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: Boolean(user?.isAdmin),
        onboardingOpen,
        setOnboardingOpen,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        updateProfileData,
        addAddress,
        removeAddress,
        triggerPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
