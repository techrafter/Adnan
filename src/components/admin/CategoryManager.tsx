'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Category, Product } from '@/types';
import { Plus, Edit2, Trash2, X, UploadCloud, Search, Layers, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl, uploadToCloudinary } from '@/lib/cloudinary';

const DEFAULT_STARTER_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    icon: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Milk & Dairy",
    slug: "milk-dairy",
    icon: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Spices & Sauces",
    slug: "spices-sauces",
    icon: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Flour & Atta",
    slug: "flour",
    icon: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Oil & Ghee",
    slug: "oil-ghee",
    icon: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Beverages",
    slug: "beverages",
    icon: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Chicken & Meat",
    slug: "chicken-meat",
    icon: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  },
  {
    name: "Cleaning & Homecare",
    slug: "cleaning-homecare",
    icon: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&auto=format&fit=crop&q=80",
    itemCount: 0
  }
];

interface CategoryManagerProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  onUpdateCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeedStarterCategories = () => {
    DEFAULT_STARTER_CATEGORIES.forEach((cat) => {
      const exists = categories.some((c) => c.slug === cat.slug);
      if (!exists) {
        onAddCategory(cat);
      }
    });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIcon('https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setIcon(c.icon);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setIcon(url);
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) return;

    const finalSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const count = products.filter(p => p.category === finalSlug).length;

    const payload = {
      name,
      slug: finalSlug,
      icon,
      itemCount: count
    };

    if (editingCategory) {
      onUpdateCategory({ ...editingCategory, ...payload });
    } else {
      onAddCategory(payload);
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
            placeholder="Search store categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {categories.length === 0 && (
            <button
              onClick={handleSeedStarterCategories}
              className="bg-emerald-50 hover:bg-emerald-100 text-brand-700 border border-emerald-300 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Starter Categories</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-initial bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h5 className="font-extrabold text-slate-800 text-sm">No Categories Currently Added</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click <strong>"Add New Category"</strong> to add your custom categories with Cloudinary image thumbnails, or click <strong>"Load Starter Categories"</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={handleSeedStarterCategories}
                className="bg-brand-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs"
              >
                Load Starter Categories (1-Click)
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Category Thumbnail</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">URL Slug</th>
                  <th className="p-3.5">Available Products</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const availableCount = products.filter(p => p.category === cat.slug).length;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 p-1">
                            <Image
                              src={getOptimizedImageUrl(cat.icon, 150)}
                              alt={cat.name}
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                        {cat.name}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-xs">
                        {cat.slug}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-emerald-700" />
                          {availableCount} items in store
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
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
        )}
      </div>

      {/* Modal for Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-lg text-slate-900">
                {editingCategory ? 'Edit Store Category' : 'Create New Category'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Title / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Fresh Fruits & Vegetables"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Slug (URL Identifier)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. fruits-vegetables"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              {/* Cloudinary Image Picker & Thumbnail Icon Box */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Category Thumbnail Box</label>

                {/* Live Preview Box */}
                {icon && (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shadow-sm mx-auto my-2 p-1 group">
                    <Image
                      src={getOptimizedImageUrl(icon, 200)}
                      alt="Thumbnail Preview"
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
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Thumbnail Image URL"
                    required
                  />
                  <label className="bg-slate-900 hover:bg-black text-white px-3 py-2.5 rounded-xl cursor-pointer font-bold flex items-center gap-1.5 shrink-0 text-xs shadow-sm">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
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
                  {isUploading ? 'Uploading Image...' : editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
