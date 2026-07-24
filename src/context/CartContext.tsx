'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '@/types';
import { MOCK_COUPONS } from '@/lib/mockData';

const FREE_DELIVERY_THRESHOLD = 1000;
const STANDARD_DELIVERY_FEE = 50;

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  totalSavings: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  freeDeliveryThreshold: number;
  amountAwayFromFreeDelivery: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('adnan_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart local storage', e);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('adnan_cart', JSON.stringify(updatedCart));
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) return;
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }

    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('adnan_cart');
  };

  const getItemQuantity = (productId: string): number => {
    const found = cart.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  // Real-time Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);
  const amountAwayFromFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Real-time Savings calculation: Difference between original prices and current prices + coupons
  const productSavings = cart.reduce((acc, item) => {
    const orig = item.product.originalPrice || item.product.price;
    const diff = Math.max(0, orig - item.product.price);
    return acc + diff * item.quantity;
  }, 0);
  const totalSavings = productSavings + discount;

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    let availableCoupons: Coupon[] = MOCK_COUPONS;
    try {
      const saved = localStorage.getItem('adnan_coupons');
      if (saved) {
        availableCoupons = JSON.parse(saved);
      }
    } catch (e) {}

    const found = availableCoupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive promo coupon code.' };
    }
    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount required for coupon ${found.code} is Rs. ${found.minOrderAmount}`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Promo coupon '${found.code}' applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        subtotal,
        discount,
        deliveryFee,
        totalAmount,
        totalSavings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountAwayFromFreeDelivery,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
