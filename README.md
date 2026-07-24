# 🛒 Adnan Super Store - Production E-Commerce Platform (Web + Mobile App)

A production-ready, ultra-fast, and secure E-Commerce Platform built for **"Adnan Super Store"** (exclusively serving **Shve Ada City**). 

Featuring Next.js 14 App Router, Firebase Google OAuth & Firestore Realtime DB, Cloudinary API (`f_auto`, `q_auto` image optimization), automated WhatsApp checkout, User Dashboard with 1-click Re-Order, Admin User Management Dashboard, Live Storefront Visual Preview, and a cross-platform React Native / Expo Mobile App.

---

## 📁 Modular Project Directory Structure

```text
Adnan/
├── src/
│   ├── app/
│   │   ├── admin/             # Admin Panel & User Management (/admin)
│   │   ├── checkout/          # Multi-step WhatsApp Checkout (/checkout)
│   │   ├── product/[id]/      # Product Detail Page (/product/p-101)
│   │   ├── profile/           # User Dashboard & Account Settings (/profile)
│   │   ├── globals.css        # Tailwind CSS styling system
│   │   ├── layout.tsx         # Root Layout with AuthProvider & CartProvider
│   │   └── page.tsx           # Home Storefront Catalog Page
│   ├── components/
│   │   ├── admin/             # ProductManager, OrderStream, UserManagement, PaymentConfig
│   │   ├── auth/              # AuthModal (Google OAuth, Email Auth, Onboarding form)
│   │   ├── checkout/          # PaymentGatewaySelector, ReceiptUploader
│   │   ├── layout/            # Header, CategoryNav, Footer
│   │   └── storefront/        # ProductGrid, CategoryGrid, CartDrawer, HeroBanner
│   ├── context/
│   │   ├── AuthContext.tsx    # Firebase Auth, Google OAuth, Firestore User Profile, Address Sync
│   │   └── CartContext.tsx    # Persistent Shopping Cart & Coupon Engine
│   ├── lib/
│   │   ├── cloudinary.ts      # Cloudinary API & f_auto, q_auto Image Transformer
│   │   ├── firebase.ts        # Firebase Auth & Firestore Singleton Setup
│   │   ├── mockData.ts        # Initial Store Catalog & Payment Accounts
│   │   └── whatsapp.ts        # Formatted WhatsApp Order Payload Generator
│   └── types/
│       └── index.ts           # Product, UserProfile, Order, Address, PaymentAccount types
├── mobile/
│   ├── App.tsx                # Cross-Platform React Native / Expo Mobile Application
│   ├── app.json               # Expo App Manifest
│   └── package.json           # Mobile App Dependencies
├── firestore.rules            # Production Security Rules for Users, Orders, Catalog
└── README.md                  # Complete Setup & Production Deployment Guide
```

---

## 🔐 1. Step-by-Step Google Cloud Console Setup (OAuth 2.0)

To enable **Google One-Tap / Popup Sign-In**:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project named `adnan-super-store`.
3. Navigate to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type and click **Create**.
   - Fill App name (`Adnan Super Store`), User support email, and Developer contact info.
   - Save and continue.
4. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials > OAuth client ID**.
   - Select **Web application**.
   - Set **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://adnan-super-store.vercel.app` (or your custom domain)
   - Set **Authorized redirect URIs**:
     - `https://adnan-1c2a7.firebaseapp.com/__/auth/handler`
5. Copy the generated **Client ID** and **Client Secret**.

---

## 🔥 2. Step-by-Step Firebase Auth & Firestore Setup

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project (e.g. `adnan-1c2a7`).
3. Under **Authentication > Sign-in method**:
   - Enable **Google**: Paste your Google OAuth Client ID & Secret from Google Cloud Console.
   - Enable **Email/Password**.
4. Under **Firestore Database**:
   - Create database in `eur3` or `asia-south1`.
5. Deploy `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## ☁️ 3. Step-by-Step Cloudinary API Setup

All product and payment receipt images automatically pass through Cloudinary's `f_auto` and `q_auto` filters:

1. Sign up at [Cloudinary](https://cloudinary.com/).
2. Go to **Settings > Upload > Upload presets**.
3. Click **Add upload preset**:
   - Preset name: `adnan_preset` (or your custom name).
   - Signing Mode: **Unsigned**.
   - Save preset.
4. Copy your **Cloud Name** and **Upload Preset Name** into `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="adnan_preset"
   ```

---

## 🚀 4. Local Development & Testing

1. Clone repository & install web dependencies:
   ```bash
   npm install
   ```
2. Start Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in browser.

3. Run React Native Mobile App:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

---

## 📦 5. Production Vercel Deployment Guide

1. Push repository code to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Add the following **Environment Variables** in Vercel settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
5. Click **Deploy**. Vercel will build serverless routes with instant global CDN speed.
