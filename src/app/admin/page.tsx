'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminProductsPage from './products/page';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return <AdminProductsPage />;
}
