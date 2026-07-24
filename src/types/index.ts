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
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: 'Shve Ada City'; // Enforced location
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  receiptUrl?: string; // Cloudinary receipt image link
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  city: string;
  isAdmin: boolean;
}
