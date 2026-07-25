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
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  
  // Dynamic Unit / Weight Mode State
  const [unitType, setUnitType] = useState<'weight' | 'volume' | 'count' | 'custom'>('weight');
  const [unitValue, setUnitValue] = useState<string>('');
  const [unitSubMeasure, setUnitSubMeasure] = useState<string>('kg');
  const [customUnit, setCustomUnit] = useState<string>('');

  const [stock, setStock] = useState<string>('');
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
    setPrice('');
    setOriginalPrice('');
    setUnitType('weight');
    setUnitValue('');
    setUnitSubMeasure('kg');
    setCustomUnit('');
    setStock('');
    setImage(''); // Completely empty, no default product photo!
    setIsFeatured(false);
    setIsFlashDeal(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price ? String(p.price) : '');
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setCustomUnit(p.unit || '');
    setUnitType('custom');
    setStock(p.stock !== undefined ? String(p.stock) : '');
    setImage(p.image || '');
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

  const computeFinalUnit = () => {
    if (unitType === 'custom') return customUnit.trim() || '1 Item';
    if (!unitValue.trim()) return `1 ${unitSubMeasure}`;
    return `${unitValue.trim()} ${unitSubMeasure}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price) || 0;
    const numOriginalPrice = Number(originalPrice) || numPrice;
    const numStock = Number(stock) || 0;
    const finalUnit = computeFinalUnit();

    const discount = numOriginalPrice > numPrice ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : 0;

    const payload = {
      name: name.trim(),
      category,
      price: numPrice,
      originalPrice: numOriginalPrice,
      unit: finalUnit,
      stock: numStock,
      inStock: numStock > 0,
      image: image.trim(),
      isFeatured,
      isFlashDeal,
      discountPercentage: discount,
      description: description.trim()
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
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
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
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {p.image ? (
                            <Image
                              src={getOptimizedImageUrl(p.image, 100)}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Tag className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="font-extrabold text-slate-900 line-clamp-1">{p.name}</h5>
                          <span className="text-[10px] text-slate-400 font-semibold">{p.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize font-semibold text-slate-700">
                      {p.category.replace('-', ' ')}
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-brand-700">Rs. {p.price}</span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5 font-semibold">
                          Rs. {p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">
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
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Product Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product title..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              {/* Category & Unit Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none font-semibold capitalize cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Interactive Unit & Weight Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Measurement Type *</label>
                  <select
                    value={unitType}
                    onChange={(e) => {
                      const mode = e.target.value as any;
                      setUnitType(mode);
                      if (mode === 'weight') setUnitSubMeasure('kg');
                      else if (mode === 'volume') setUnitSubMeasure('Liter');
                      else if (mode === 'count') setUnitSubMeasure('Pack');
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none font-semibold cursor-pointer mb-2"
                  >
                    <option value="weight">⚖️ Weight (Kg / Grams)</option>
                    <option value="volume">🧪 Volume (Liter / ML)</option>
                    <option value="count">📦 Count (Pack / Piece / Dozen)</option>
                    <option value="custom">✏️ Custom Unit Text</option>
                  </select>

                  {/* Dynamic Value Input for Selected Unit Mode */}
                  {unitType === 'weight' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unitValue}
                        onChange={(e) => setUnitValue(e.target.value)}
                        placeholder="Weight e.g. 1 or 0.5"
                        className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <select
                        value={unitSubMeasure}
                        onChange={(e) => setUnitSubMeasure(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none cursor-pointer bg-slate-50"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="Gram">Gram</option>
                      </select>
                    </div>
                  )}

                  {unitType === 'volume' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unitValue}
                        onChange={(e) => setUnitValue(e.target.value)}
                        placeholder="Volume e.g. 1 or 500"
                        className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <select
                        value={unitSubMeasure}
                        onChange={(e) => setUnitSubMeasure(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none cursor-pointer bg-slate-50"
                      >
                        <option value="Liter">Liter</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  )}

                  {unitType === 'count' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unitValue}
                        onChange={(e) => setUnitValue(e.target.value)}
                        placeholder="Quantity e.g. 1 or 12"
                        className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <select
                        value={unitSubMeasure}
                        onChange={(e) => setUnitSubMeasure(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none cursor-pointer bg-slate-50"
                      >
                        <option value="Pack">Pack</option>
                        <option value="Piece">Piece</option>
                        <option value="Dozen">Dozen</option>
                        <option value="Bottle">Bottle</option>
                      </select>
                    </div>
                  )}

                  {unitType === 'custom' && (
                    <input
                      type="text"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      placeholder="Custom unit text e.g. 1 Box (500g)"
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Price & Stock Fields (Blank by default) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (Rs) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (Rs)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 300"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Product Image Preview Box & Cloudinary Upload */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Product Image Preview Box</label>

                {/* Image Wireframe Mockup Box / Upload Preview */}
                <div className="relative w-full h-36 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center transition-all overflow-hidden group">
                  {image ? (
                    <>
                      <Image
                        src={getOptimizedImageUrl(image, 350)}
                        alt="Uploaded Preview"
                        fill
                        className="object-contain p-2 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-[10px] font-bold shadow-md hover:bg-red-700 transition-colors z-10"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <UploadCloud className="w-5 h-5 text-brand-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Product Image Mockup Box</span>
                      <span className="text-[10px] text-slate-400">No image uploaded yet. Click Upload below or paste image URL.</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Or paste direct Image URL..."
                  />
                  <label className="bg-slate-900 hover:bg-black text-white px-3.5 py-2.5 rounded-xl cursor-pointer font-bold flex items-center gap-1.5 shrink-0 text-xs shadow-sm transition-colors">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description or details..."
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
                  className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
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
