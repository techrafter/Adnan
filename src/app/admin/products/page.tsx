'use client';

import React from 'react';
import { ProductManager } from '@/components/admin/ProductManager';
import { useCatalog } from '@/context/CatalogContext';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useCatalog();

  return (
    <ProductManager
      products={products}
      categories={categories}
      onAddProduct={addProduct}
      onUpdateProduct={updateProduct}
      onDeleteProduct={deleteProduct}
    />
  );
}
