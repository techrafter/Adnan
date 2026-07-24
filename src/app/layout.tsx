import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Adnan Super Store - Online Grocery & Supermarket (Razzar)',
  description: 'Shop fresh milk, dairy, farm produce, biryani spices, and daily household essentials in Razzar with fast home delivery and WhatsApp receipt checkout.',
  keywords: ['Adnan Super Store', 'Razzar', 'Grocery Pakistan', 'Bazaar Store', 'Online Supermarket', 'Milk Dairy Razzar'],
  openGraph: {
    title: 'Adnan Super Store - Razzar',
    description: 'Ultra-fast online grocery delivery exclusively serving Razzar.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Naskh+Arabic:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
