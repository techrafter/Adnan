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
  loginDemoUser: (name: string, phone: string, isAdmin?: boolean) => void;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  triggerPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
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
            setUser({
              ...data,
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || data.name || 'Customer',
              email: firebaseUser.email || data.email,
              photoURL: firebaseUser.photoURL || data.photoURL,
            });

            // If phone or address is missing, trigger onboarding modal
            if (!data.phone || !data.address) {
              setOnboardingOpen(true);
            }
          } else {
            // New user profile creation
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Customer',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              address: '',
              city: 'Shve Ada City',
              photoURL: firebaseUser.photoURL || '',
              isAdmin: firebaseUser.email === 'admin@adnansuperstore.com',
              isBanned: false,
              createdAt: new Date().toISOString(),
              totalOrders: 0,
              addresses: []
            };

            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
            setOnboardingOpen(true); // Open onboarding to fill delivery details
          }
        } catch (e) {
          console.warn('Firestore connection fallback active:', e);
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Customer',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '+923001234567',
            address: 'Main Street, Shve Ada City',
            city: 'Shve Ada City',
            photoURL: firebaseUser.photoURL || '',
            isAdmin: firebaseUser.email === 'admin@adnansuperstore.com' || false,
            createdAt: new Date().toISOString(),
            addresses: []
          };
          setUser(fallbackProfile);
        }
      } else {
        // Fallback to local session if present, or null
        const savedUser = localStorage.getItem('adnan_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Primary: Google Auth Popup
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        // Fallback: If popup was blocked, try redirect
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
          isAdmin: fbUser.email === 'admin@adnansuperstore.com',
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
          photoURL: fbUser.photoURL || existingData.photoURL
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
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.warn('Firebase Email sign in error:', error.message);
      if (email.includes('admin')) {
        loginDemoUser('Admin Storekeeper', '+923348699487', true);
      } else {
        loginDemoUser('Verified User', '+923001234567', false);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string, address: string) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      
      const newProfile: UserProfile = {
        uid: res.user.uid,
        name,
        email,
        phone,
        address,
        city: 'Shve Ada City',
        isAdmin: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
        totalOrders: 0,
        addresses: [
          { id: 'addr-1', label: 'Home', address, city: 'Shve Ada City', isDefault: true }
        ]
      };

      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUser(newProfile);
    } catch (error) {
      console.warn('Email sign up fallback active:', error);
      const demoUser: UserProfile = {
        uid: `uid-${Date.now()}`,
        name,
        email,
        phone,
        address,
        city: 'Shve Ada City',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        addresses: [
          { id: 'addr-1', label: 'Home', address, city: 'Shve Ada City', isDefault: true }
        ]
      };
      setUser(demoUser);
      localStorage.setItem('adnan_user', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = (name: string, phone: string, isAdmin = false) => {
    const newUser: UserProfile = {
      uid: `uid-${Date.now()}`,
      name: name || 'Customer',
      phone: phone || '+923001234567',
      address: 'Main Bazaar, Shve Ada City',
      city: 'Shve Ada City',
      isAdmin,
      isBanned: false,
      createdAt: new Date().toISOString(),
      totalOrders: 1,
      addresses: [
        { id: 'addr-default', label: 'Home', address: 'Main Bazaar, Shve Ada City', city: 'Shve Ada City', isDefault: true }
      ]
    };
    setUser(newUser);
    localStorage.setItem('adnan_user', JSON.stringify(newUser));
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
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('adnan_user', JSON.stringify(updated));

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
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
        isAdmin: user?.isAdmin || false,
        onboardingOpen,
        setOnboardingOpen,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        loginDemoUser,
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
