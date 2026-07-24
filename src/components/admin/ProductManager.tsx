'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { Plus, Edit2, Trash2, Check, X, UploadCloud, Search, Tag, Eye } from 'lucide-react';
import { getOptimizedImageUrl, uploadToCloudinary } from '@/lib/cloudinary';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.slug || 'milk-dairy');
  const [price, setPrice] = useState<number>(100);
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [unit, setUnit] = useState('1 Pack');
  const [stock, setStock] = useState<number>(20);
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory(categories[0]?.slug || 'milk-dairy');
    setPrice(100);
    setOriginalPrice(120);
    setUnit('1 Pack');
    setStock(20);
    setImage('https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80');
    setIsFeatured(false);
    setIsFlashDeal(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setUnit(p.unit);
    setStock(p.stock);
    setImage(p.image);
    setIsFeatured(p.isFeatured || false);
    setIsFlashDeal(p.isFlashDeal || false);
    setDescription(p.description || '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const payload = {
      name,
      category,
      price,
      originalPrice,
      unit,
      stock,
      inStock: stock > 0,
      image,
      isFeatured,
      isFlashDeal,
      discountPercentage: discount,
      description
    };

    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...payload });
    } else {
      onAddProduct(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price & Discount</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const discount = p.originalPrice && p.originalPrice > p.price 
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 p-1">
                          <Image
                            src={getOptimizedImageUrl(p.image, 150)}
                            alt={p.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{p.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700 capitalize">
                      {p.category.replace('-', ' ')}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      Rs. {p.price}
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 line-through font-normal">
                            Rs. {p.originalPrice}
                          </span>
                          {discount > 0 && (
                            <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 rounded">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-mono font-bold text-xs ${p.stock > 5 ? 'text-slate-800' : 'text-amber-600'}`}>
                        {p.stock} in store
                      </span>
                    </td>
                    <td className="p-3.5">
                      {p.inStock ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-lg text-slate-900">
                {editingProduct ? 'Edit Store Product' : 'Add New Product'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Olper's Full Cream UHT Milk"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none font-semibold capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Weight</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 1 Liter, 1 kg, 500g Pack"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (Rs)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (Rs)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Available</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Cloudinary Image Picker & Icon Preview Box */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Product Image Preview Box</label>

                {/* Icon Preview Box */}
                {image && (
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shadow-sm mx-auto my-2 p-1 group">
                    <Image
                      src={getOptimizedImageUrl(image, 250)}
                      alt="Product Preview"
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      Preview Box
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Image URL"
                    required
                  />
                  <label className="bg-slate-900 hover:bg-black text-white px-3 py-2.5 rounded-xl cursor-pointer font-bold flex items-center gap-1.5 shrink-0 text-xs shadow-sm">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh quality item description..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-brand-600 w-4 h-4 rounded"
                  />
                  <span>Featured Item</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="accent-brand-600 w-4 h-4 rounded"
                  />
                  <span>Flash Deal</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-md transition-all active:scale-95"
                >
                  {isUploading ? 'Uploading Image...' : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
