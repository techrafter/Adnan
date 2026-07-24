import { Category, Product, PaymentAccount, Coupon, Order } from '@/types';

export const STORE_LOCATION = "Razzar";
export const ADMIN_WHATSAPP_NUMBER = "+923348699487"; // Store Admin WhatsApp Number

// Clean dynamic initial arrays - populated exclusively by Admin CMS via Firestore real-time sync
export const MOCK_CATEGORIES: Category[] = [];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: "pa-1",
    methodName: "EasyPaisa",
    type: "mobile_wallet",
    accountTitle: "Adnan Super Store Razzar",
    accountNumber: "03348699487",
    instructions: "Transfer total order amount to this EasyPaisa account and upload receipt screenshot.",
    isActive: true
  },
  {
    id: "pa-2",
    methodName: "JazzCash",
    type: "mobile_wallet",
    accountTitle: "Adnan Super Store Razzar",
    accountNumber: "03348699487",
    instructions: "Send money via JazzCash App or *786# and upload transfer receipt.",
    isActive: true
  },
  {
    id: "pa-3",
    methodName: "Meezan Bank Ltd",
    type: "bank_transfer",
    accountTitle: "Adnan Traders & Super Store",
    accountNumber: "01020304050607",
    iban: "PK36MEZN0001020304050607",
    bankName: "Meezan Bank Razzar Branch",
    instructions: "Make IBFT online bank transfer to IBAN and upload screenshot.",
    isActive: true
  },
  {
    id: "pa-4",
    methodName: "Cash on Delivery (COD)",
    type: "cod",
    accountTitle: "Razzar Local Express",
    accountNumber: "Pay cash at doorstep",
    instructions: "Pay full amount in cash upon receiving your order in Razzar.",
    isActive: true
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    code: "ADNAN10",
    type: "percentage",
    value: 10,
    minOrderAmount: 500,
    expiryDate: "2026-12-31",
    isActive: true
  },
  {
    id: "cp-2",
    code: "WELCOME50",
    type: "fixed",
    value: 50,
    minOrderAmount: 300,
    expiryDate: "2026-12-31",
    isActive: true
  }
];

export const MOCK_ORDERS: Order[] = [];
