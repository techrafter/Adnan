'use client';

import React from 'react';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { useCatalog } from '@/context/CatalogContext';

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useCatalog();

  return (
    <CategoryManager
      categories={categories}
      products={products}
      onAddCategory={addCategory}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
    />
  );
}
