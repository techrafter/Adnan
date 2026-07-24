import { Category, Product, PaymentAccount, Coupon, Order } from '@/types';

export const STORE_LOCATION = "Shve Ada City";
export const ADMIN_WHATSAPP_NUMBER = "+923001234567"; // Store Admin WhatsApp Number

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Baby Care",
    slug: "baby-care",
    icon: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80",
    itemCount: 14
  },
  {
    id: "cat-2",
    name: "Beverages",
    slug: "beverages",
    icon: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80",
    itemCount: 28
  },
  {
    id: "cat-3",
    name: "Breakfast",
    slug: "breakfast",
    icon: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&auto=format&fit=crop&q=80",
    itemCount: 19
  },
  {
    id: "cat-4",
    name: "Chicken & Meat",
    slug: "chicken-meat",
    icon: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&auto=format&fit=crop&q=80",
    itemCount: 12
  },
  {
    id: "cat-5",
    name: "Cleaning & Homecare",
    slug: "cleaning-homecare",
    icon: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&auto=format&fit=crop&q=80",
    itemCount: 31
  },
  {
    id: "cat-6",
    name: "Dessert & Baking",
    slug: "dessert-baking",
    icon: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80",
    itemCount: 16
  },
  {
    id: "cat-7",
    name: "Flour & Atta",
    slug: "flour",
    icon: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80",
    itemCount: 8
  },
  {
    id: "cat-8",
    name: "Frozen Foods",
    slug: "frozen",
    icon: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80",
    itemCount: 22
  },
  {
    id: "cat-9",
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    icon: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80",
    itemCount: 45
  },
  {
    id: "cat-10",
    name: "Hair Care",
    slug: "hair-care",
    icon: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&auto=format&fit=crop&q=80",
    itemCount: 15
  },
  {
    id: "cat-11",
    name: "Jar & Canned Foods",
    slug: "canned-foods",
    icon: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=200&auto=format&fit=crop&q=80",
    itemCount: 18
  },
  {
    id: "cat-12",
    name: "Milk & Dairy",
    slug: "milk-dairy",
    icon: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&auto=format&fit=crop&q=80",
    itemCount: 26
  },
  {
    id: "cat-13",
    name: "Oil & Ghee",
    slug: "oil-ghee",
    icon: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80",
    itemCount: 14
  },
  {
    id: "cat-14",
    name: "Spices & Sauces",
    slug: "spices-sauces",
    icon: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&auto=format&fit=crop&q=80",
    itemCount: 30
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p-101",
    name: "Adnan Select Premium Biryani Spice Mix",
    category: "spices-sauces",
    price: 155,
    originalPrice: 260,
    unit: "100g Pack",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
    stock: 45,
    inStock: true,
    isFeatured: true,
    isFlashDeal: true,
    discountPercentage: 40,
    description: "Authentic, freshly ground aromatic spices carefully blended for traditional Pakistani Biryani."
  },
  {
    id: "p-102",
    name: "Olper's Full Cream UHT Milk",
    category: "milk-dairy",
    price: 290,
    originalPrice: 310,
    unit: "1 Liter",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",
    stock: 120,
    inStock: true,
    isFeatured: true,
    discountPercentage: 6,
    description: "Pure and rich full cream milk processed under international quality standards."
  },
  {
    id: "p-103",
    name: "Sunridge Fine Whole Wheat Atta",
    category: "flour",
    price: 1350,
    originalPrice: 1480,
    unit: "10 kg Bag",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    stock: 30,
    inStock: true,
    isFeatured: true,
    discountPercentage: 9,
    description: "Chakki fresh whole wheat flour for soft and nutritious rotis."
  },
  {
    id: "p-104",
    name: "Knorr Chicken Nuggets Family Pack",
    category: "frozen",
    price: 890,
    originalPrice: 1050,
    unit: "500g Pack",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    stock: 15,
    inStock: true,
    isFlashDeal: true,
    discountPercentage: 15,
    description: "Crispy and juicy chicken nuggets ready to fry or bake in minutes."
  },
  {
    id: "p-105",
    name: "Dalda Cooking Oil Poly Bag",
    category: "oil-ghee",
    price: 520,
    originalPrice: 560,
    unit: "1 Liter Pouch",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    stock: 50,
    inStock: true,
    isFeatured: true,
    discountPercentage: 7,
    description: "Cholesterol-free premium cooking oil enriched with Vitamins A & D."
  },
  {
    id: "p-106",
    name: "Fresh Red Apples (Shve Ada Farm Direct)",
    category: "fruits-vegetables",
    price: 240,
    originalPrice: 280,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    stock: 80,
    inStock: true,
    isFeatured: true,
    discountPercentage: 14,
    description: "Crisp, sweet local farm apples delivered daily to Shve Ada residents."
  },
  {
    id: "p-107",
    name: "Farm Fresh Eggs Tray",
    category: "breakfast",
    price: 360,
    originalPrice: 400,
    unit: "30 Eggs",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80",
    stock: 25,
    inStock: true,
    discountPercentage: 10,
    description: "Grade-A fresh white eggs packed with proteins for daily breakfast."
  },
  {
    id: "p-108",
    name: "Tapal Danedar Black Tea",
    category: "beverages",
    price: 680,
    originalPrice: 750,
    unit: "450g Pack",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    stock: 0,
    inStock: false,
    discountPercentage: 9,
    description: "Rich color and strong aroma tea leaves for authentic Karak Chai."
  },
  {
    id: "p-109",
    name: "Nestle Everyday Milk Powder",
    category: "breakfast",
    price: 490,
    originalPrice: 530,
    unit: "375g Pack",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    stock: 40,
    inStock: true,
    discountPercentage: 8,
    description: "Specially crafted tea whitener for perfect creamy tea."
  },
  {
    id: "p-110",
    name: "Fresh Boneless Chicken Breast",
    category: "chicken-meat",
    price: 780,
    originalPrice: 850,
    unit: "1 kg Pack",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80",
    stock: 18,
    inStock: true,
    isFeatured: true,
    discountPercentage: 8,
    description: "Hygienically processed and vacuum sealed lean chicken breast."
  },
  {
    id: "p-111",
    name: "Surf Excel Washing Powder",
    category: "cleaning-homecare",
    price: 640,
    originalPrice: 700,
    unit: "1 kg Pack",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
    stock: 35,
    inStock: true,
    discountPercentage: 8,
    description: "Tough stain removal detergent for bright and clean clothes."
  },
  {
    id: "p-112",
    name: "Pampers Baby Dry Diapers (Medium)",
    category: "baby-care",
    price: 2450,
    originalPrice: 2800,
    unit: "44 Diapers Pack",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
    stock: 14,
    inStock: true,
    discountPercentage: 12,
    description: "Ultra-absorbent baby diapers for uninterrupted overnight sleep."
  }
];

export const MOCK_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: "pa-1",
    methodName: "EasyPaisa",
    type: "mobile_wallet",
    accountTitle: "Adnan Super Store Shve Ada",
    accountNumber: "03001234567",
    instructions: "Transfer total order amount to this EasyPaisa account and upload receipt screenshot.",
    isActive: true
  },
  {
    id: "pa-2",
    methodName: "JazzCash",
    type: "mobile_wallet",
    accountTitle: "Adnan Super Store Shve Ada",
    accountNumber: "03017654321",
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
    bankName: "Meezan Bank Shve Ada Branch",
    instructions: "Make IBFT online bank transfer to IBAN and upload screenshot.",
    isActive: true
  },
  {
    id: "pa-4",
    methodName: "Cash on Delivery (COD)",
    type: "cod",
    accountTitle: "Shve Ada Local Express",
    accountNumber: "Pay cash at doorstep",
    instructions: "Pay full amount in cash upon receiving your order in Shve Ada City.",
    isActive: true
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    code: "ADNAN10",
    type: "percentage",
    value: 10,
    minOrderAmount: 1000,
    expiryDate: "2026-12-31",
    isActive: true
  },
  {
    id: "cp-2",
    code: "SHVEADA50",
    type: "fixed",
    value: 50,
    minOrderAmount: 500,
    expiryDate: "2026-12-31",
    isActive: true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-9821",
    customerName: "Muhammad Bilal",
    customerPhone: "+923019876543",
    address: "House 14, Block B, Main Bazaar, Shve Ada City",
    city: "Shve Ada City",
    items: [
      { productId: "p-101", name: "Adnan Select Premium Biryani Spice Mix", price: 155, quantity: 2, unit: "100g Pack" },
      { productId: "p-102", name: "Olper's Full Cream UHT Milk", price: 290, quantity: 3, unit: "1 Liter" }
    ],
    subtotal: 1180,
    discount: 50,
    deliveryFee: 50,
    totalAmount: 1180,
    paymentMethod: "EasyPaisa",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "Pending",
    createdAt: new Date().toISOString(),
    notes: "Please call before arriving."
  },
  {
    id: "ORD-9820",
    customerName: "Zainab Fatima",
    customerPhone: "+923024567890",
    address: "Near Girls College, Station Road, Shve Ada City",
    city: "Shve Ada City",
    items: [
      { productId: "p-103", name: "Sunridge Fine Whole Wheat Atta", price: 1350, quantity: 1, unit: "10 kg Bag" }
    ],
    subtotal: 1350,
    discount: 0,
    deliveryFee: 0,
    totalAmount: 1350,
    paymentMethod: "JazzCash",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "Paid",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];
