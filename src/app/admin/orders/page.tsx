'use client';

import React, { useState, useEffect } from 'react';
import { OrderStream } from '@/components/admin/OrderStream';
import { Order } from '@/types';
import { MOCK_ORDERS } from '@/lib/mockData';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    const savedOrders = localStorage.getItem('adnan_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
    }
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem('adnan_orders', JSON.stringify(updated));
  };

  return (
    <OrderStream
      orders={orders}
      onUpdateStatus={handleUpdateOrderStatus}
    />
  );
}
