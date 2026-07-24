# 🛒 Adnan Super Store - Production E-Commerce Platform

Production-ready, ultra-fast, and secure E-Commerce Web Application built specifically for **"Adnan Super Store"** (exclusively serving **Shve Ada City**). 

Modeled after the **Bazaar** reference layout, featuring a clean top location badge, search auto-complete, promo hero banner slider, soft category cards grid, persistent shopping cart, receipt uploader engine, WhatsApp order generator, and a live Admin Panel CMS.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling & Aesthetics**: Tailwind CSS (Curated Bazaar emerald color system, soft rounded light card grids, smooth transitions)
- **Icons**: Lucide React
- **Database & Auth**: Firebase Firestore (Realtime DB) & Firebase Auth (`src/lib/firebase.ts`, `firestore.rules`)
- **Image Optimization & Hosting**: Cloudinary API (`f_auto`, `q_auto`, dynamic image transformations via `src/lib/cloudinary.ts`)
- **Deployment**: Vercel-ready with environment variables configuration

---

## 🌐 Key Features & Workflow

### 1. Storefront Experience (Bazaar Layout)
- **Top Location Badge**: Fixed to `📍 Shve Ada City, Pakistan` (Restricted delivery location).
- **Auto-Suggest Search Bar**: Instant search modal with keyboard shortcut `⌘K` trigger.
- **Top Category Navigation Bar**: Horizontal scrolling bar with instant category filters.
- **Spend Goal Progress Banner**: Dynamic progress bar calculating `"You are Rs. X away from FREE Home Delivery"`.
- **Hero Promo Banner**: Bazaar Select style banner slider with CTA buttons and deal pricing.
- **Product Catalog**: Cards with discount badges, inventory stock status (In Stock / Out of Stock), and instant quantity counters (`- 1 +`).

### 2. WhatsApp Checkout & Receipt Engine
- **Multi-Step Checkout**: Input customer details & address in **Shve Ada City**.
- **Payment Method Selector**: Select EasyPaisa, JazzCash, Meezan Bank IBFT, or Cash on Delivery (COD).
- **Cloudinary Receipt Screenshot Upload**: Drag-and-drop receipt screenshot with auto-compression (`f_auto, q_auto`) and preview.
- **WhatsApp Pre-filled Redirect**: Generates formatted WhatsApp payload containing Order ID, Customer Name, Address, Itemized List, Total Amount, and Cloudinary Receipt Screenshot URL.

### 3. Advanced Admin Panel & CMS (`/admin`)
- **Analytics Widgets**: Total Revenue, Active Orders, Catalog Items, and Out of Stock Alerts.
- **Live Inventory Manager**: Add, Edit, Delete products, adjust prices, stock count, and upload images to Cloudinary instantly.
- **Order Stream**: Real-time incoming order stream with status workflow (`Pending` ➔ `Paid` ➔ `Shipped` ➔ `Delivered`) and receipt screenshot inspection.
- **Dynamic Payment Gateway Setup**: Manage up to 5 payment accounts (EasyPaisa, JazzCash, Meezan Bank, COD).
- **Coupon Manager**: Create percentage (%) or flat PKR discount codes.
- **Live Customer Storefront Toggle**: Direct preview link.

---

## 🚀 Setup & Installation Instructions

### 1. Clone & Install Dependencies
```bash
cd Adnan
npm install
```

### 2. Local Environment Setup
Copy `.env.example` to `.env.local` and add your real credentials:
```bash
cp .env.example .env.local
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Cloudinary SDK & Image Transformation Setup

All uploaded product thumbnails and customer payment receipt screenshots automatically pass through Cloudinary's auto-format and auto-compress pipeline:
```typescript
// Auto-injected transformation flags: f_auto, q_auto, w_600
getOptimizedImageUrl(url, width = 600, quality = 'auto')
```

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Create an **Unsigned Upload Preset** under `Settings > Upload > Upload presets`.
3. Set your Cloud Name and Upload Preset in `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset_name"
   ```

---

## 🔥 Firebase Firestore & Security Rules Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore Database and Firebase Auth (Phone / Email).
3. Deploy the included `firestore.rules` file:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 📦 Deployment to Vercel

1. Push code to GitHub repository.
2. Import project into Vercel.
3. Configure the Environment Variables under **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   - `NEXT_PUBLIC_STORE_LOCATION`
4. Click **Deploy**.
