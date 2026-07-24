'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { MOCK_PRODUCTS, STORE_LOCATION } from '@/lib/mockData';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Plus, Minus, ShieldCheck, MapPin, Truck, Flame } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [productsList, setProductsList] = React.useState<Product[]>(MOCK_PRODUCTS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('adnan_products');
      if (saved) {
        setProductsList(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const product = productsList.find((p) => p.id === productId) || productsList[0] || MOCK_PRODUCTS[0];

  const { addToCart, updateQuantity, getItemQuantity, setIsCartOpen } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header onOpenSearch={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumb / Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grocery Catalog</span>
        </Link>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Image */}
          <div className="md:col-span-6 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-4 flex items-center justify-center">
            <Image
              src={getOptimizedImageUrl(product.image, 800)}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />

            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-brand-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                  {product.category.replace('-', ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {product.unit}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {product.description || 'Premium quality grocery essential delivered fresh to your doorstep in Shve Ada City.'}
              </p>

              {/* Price display */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  Rs. {product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs mb-6">
                {product.inStock ? (
                  <span className="text-emerald-700 font-extrabold bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="text-red-700 font-extrabold bg-red-100 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Delivery badge */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Express Local Delivery in {STORE_LOCATION}</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Orders placed before 8 PM are delivered within 30 minutes in Shve Ada City.
              </p>
            </div>

            {/* Quantity adjustment & Add button */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              {quantityInCart > 0 ? (
                <div className="flex items-center bg-brand-600 text-white rounded-2xl p-2 shadow-md flex-1 justify-between max-w-xs">
                  <button
                    onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                    className="p-2 hover:bg-brand-700 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm">{quantityInCart} in Cart</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                    className="p-2 hover:bg-brand-700 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={!product.inStock}
                  className={`flex-1 max-w-xs py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3.5 rounded-2xl transition-colors"
              >
                View Cart
              </button>
            </div>

          </div>

        </div>

      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
