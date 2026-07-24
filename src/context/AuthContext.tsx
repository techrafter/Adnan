'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  loginDemoUser: (name: string, phone: string, isAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check saved session in localStorage
    const savedUser = localStorage.getItem('adnan_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    } else {
      // Default initial customer session
      const defaultUser: UserProfile = {
        uid: 'user-demo-1',
        name: 'Guest Customer',
        phone: '+923001112233',
        city: 'Shve Ada City',
        isAdmin: false
      };
      setUser(defaultUser);
    }
  }, []);

  const loginDemoUser = (name: string, phone: string, isAdmin = false) => {
    const newUser: UserProfile = {
      uid: `uid-${Date.now()}`,
      name: name || 'Customer',
      phone: phone || '+923000000000',
      city: 'Shve Ada City',
      isAdmin
    };
    setUser(newUser);
    localStorage.setItem('adnan_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adnan_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.isAdmin || false, loginDemoUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
