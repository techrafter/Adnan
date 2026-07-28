export interface SiteSettings {
  logoUrl?: string;
  storeName?: string;
  tagline?: string;
  phone?: string;
  announcementText?: string;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  targetCategory?: string;
  targetUrl?: string;
  isActive: boolean;
  isForever?: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // URL or Lucide icon key
  description?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string; // Category slug or ID
  price: number;
  originalPrice?: number; // For discount calculation
  unit: string; // e.g. "1 kg", "500 ml", "1 Pack"
  image: string;
  stock: number;
  inStock: boolean;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  discountPercentage?: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentAccount {
  id: string;
  methodName: string; // e.g. "EasyPaisa", "JazzCash", "Meezan Bank", "Cash on Delivery"
  type: 'mobile_wallet' | 'bank_transfer' | 'cod';
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  bankName?: string;
  instructions: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 (%) or 100 (PKR)
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other' | string;
  address: string;
  city: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  receiptUrl?: string; // Cloudinary receipt image link
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  photoURL?: string;
  isAdmin: boolean;
  isBanned?: boolean;
  createdAt?: string;
  totalOrders?: number;
  addresses?: Address[];
}
