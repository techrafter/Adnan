'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { QuickSearchModal } from '@/components/storefront/QuickSearchModal';
import { Order, Address } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  User, Package, MapPin, ShieldCheck, RefreshCw, KeyRound, Plus, Trash2, 
  ExternalLink, CheckCircle2, Clock, Truck, ShoppingCart, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ProfileContent() {
  const router = useRouter();
  const { user, updateProfileData, addAddress, removeAddress, triggerPasswordReset } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as 'profile' | 'orders' | 'addresses' | 'settings') || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'settings'>(initialTab);

  // Sync searchParams URL query to activeTab state whenever URL changes
  useEffect(() => {
    const syncTab = () => {
      let t: string | null = null;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        t = urlParams.get('tab');
      }
      if (!t) {
        t = searchParams.get('tab');
      }
      if (t === 'profile' || t === 'orders' || t === 'addresses' || t === 'settings') {
        setActiveTab(t);
      } else if (!t) {
        setActiveTab('profile');
      }
    };

    syncTab();
  }, [searchParams]);

  const handleTabChange = (tab: 'profile' | 'orders' | 'addresses' | 'settings') => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`, { scroll: false });
  };

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New address state
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [newAddrText, setNewAddrText] = useState('');
  const [showAddAddr, setShowAddAddr] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  // Password reset state
  const [resetSent, setResetSent] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    const fetchedOrders: Order[] = [];

    // 1. Fetch real user orders from Firestore database
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerPhone', '==', user.phone || '')
      );
      const querySnap = await getDocs(q);
      querySnap.forEach((docSnap) => {
        fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
    } catch (e) {
      console.warn('Firestore orders fetch fallback:', e);
    }

    // 2. Fetch real orders placed in this session/device from localStorage stream
    try {
      const savedOrders = localStorage.getItem('adnan_orders');
      if (savedOrders) {
        const localOrders: Order[] = JSON.parse(savedOrders);
        if (Array.isArray(localOrders)) {
          localOrders.forEach((o) => {
            if (!fetchedOrders.some((f) => f.id === o.id)) {
              if (
                (user.phone && o.customerPhone === user.phone) ||
                (user.name && o.customerName === user.name) ||
                (user.uid && o.userId === user.uid) ||
                !o.userId
              ) {
                fetchedOrders.push(o);
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('LocalStorage orders fetch error:', e);
    }

    fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(fetchedOrders);
    setOrdersLoading(false);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({ name, phone, address });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText) return;
    const newAddressItem: Address = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      address: newAddrText,
      city: 'Shve Ada City',
      isDefault: false
    };
    await addAddress(newAddressItem);
    setNewAddrText('');
    setShowAddAddr(false);
  };

  const handleReorder = (pastOrder: Order) => {
    pastOrder.items.forEach((item) => {
      addToCart({
        id: item.productId,
        name: item.name,
        category: 'groceries',
        price: item.price,
        unit: item.unit,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        stock: 50,
        inStock: true
      }, item.quantity);
    });

    setReorderSuccess(`Added all items from #${pastOrder.id} to cart!`);
    setIsCartOpen(true);
    setTimeout(() => setReorderSuccess(null), 4000);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-600" /> Shipped</span>;
      case 'Paid':
      case 'Processing':
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" /> Processing</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <div>
        <Header onOpenSearch={() => setSearchModalOpen(true)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-800">User Dashboard</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 h-fit">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-500/20 mb-3 shadow-md" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-600 text-white font-black text-2xl flex items-center justify-center mb-3 shadow-md">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
                  </div>
                )}
                <h2 className="text-lg font-black text-slate-900">{user?.name || 'Customer Profile'}</h2>
                <p className="text-xs text-slate-500">{user?.email || user?.phone || 'Shve Ada Customer'}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Customer
                </div>
              </div>

              <nav className="mt-6 space-y-2">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Personal Profile</span>
                </button>

                <button
                  onClick={() => handleTabChange('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Order History & Re-Order</span>
                </button>

                <button
                  onClick={() => handleTabChange('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </button>

                <button
                  onClick={() => handleTabChange('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Security & Password</span>
                </button>
              </nav>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-3">

              {reorderSuccess && (
                <div className="mb-6 p-4 bg-brand-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShoppingCart className="w-5 h-5" />
                    <span>{reorderSuccess}</span>
                  </div>
                  <button onClick={() => setIsCartOpen(true)} className="px-3 py-1 bg-white text-brand-900 rounded-lg text-xs font-extrabold">
                    View Cart
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Your Past Orders</h3>
                      <p className="text-xs text-slate-500">View live status, payment receipts, and re-order in 1-click.</p>
                    </div>
                    <button
                      onClick={fetchUserOrders}
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-colors"
                      title="Refresh Orders"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                      <span>Loading your order history...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h4 className="text-base font-extrabold text-slate-800">You have no order history</h4>
                      <p className="text-xs text-slate-400 mt-1 mb-5">Place your first grocery order to track real-time delivery and order receipts here.</p>
                      <Link href="/" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-block">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all bg-white">
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900">#{order.id}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Ordered on {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Re-Order Items</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900">{item.quantity}x</span>
                                  <span className="text-slate-700 font-medium">{item.name} ({item.unit})</span>
                                </div>
                                <span className="font-bold text-slate-900">Rs. {item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-2 border border-slate-100">
                            <div className="space-x-4 text-slate-600">
                              <span>Payment: <strong className="text-slate-900">{order.paymentMethod}</strong></span>
                              <span>Address: <strong className="text-slate-900">{order.address}</strong></span>
                            </div>
                            <div className="font-extrabold text-brand-800 text-sm">
                              Total: Rs. {order.totalAmount}
                            </div>
                          </div>

                          {order.receiptUrl && (
                            <div className="mt-3 text-right">
                              <a
                                href={order.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> View Cloudinary Receipt
                              </a>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Personal Profile Details</h3>
                    <p className="text-xs text-slate-500">Update your store contact information and default address.</p>
                  </div>

                  {saveSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary Shipping Address</label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value="Shve Ada City"
                        disabled
                        className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-brand-900 font-bold rounded-xl text-sm cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Saved Addresses</h3>
                      <p className="text-xs text-slate-500">Manage multiple delivery locations (Home, Office).</p>
                    </div>
                    <button
                      onClick={() => setShowAddAddr(!showAddAddr)}
                      className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Address
                    </button>
                  </div>

                  {showAddAddr && (
                    <form onSubmit={handleAddNewAddress} className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">Add New Shipping Location</h4>
                      <div className="flex gap-2">
                        {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setNewAddrLabel(lbl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              newAddrLabel === lbl
                                ? 'bg-brand-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Street Address, House #, Shve Ada City"
                        value={newAddrText}
                        onChange={(e) => setNewAddrText(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">Save</button>
                        <button type="button" onClick={() => setShowAddAddr(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((addr) => (
                        <div key={addr.id} className="p-4 border border-slate-200 rounded-2xl relative bg-white shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-extrabold rounded-md uppercase">
                              {addr.label}
                            </span>
                            <button
                              onClick={() => removeAddress(addr.id)}
                              className="text-slate-400 hover:text-red-600 p-1"
                              title="Delete Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs font-semibold text-slate-800">{addr.address}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{addr.city}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                        No additional saved addresses. Add a Home or Office address above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Security & Credentials</h3>
                    <p className="text-xs text-slate-500">Manage password recovery and connected accounts.</p>
                  </div>

                  <div className="space-y-6 max-w-lg">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Google OAuth Account</p>
                          <p className="text-[11px] text-slate-500">Connected for fast one-tap sign in.</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold">
                        Connected
                      </span>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-800 mb-1">Reset Account Password</h4>
                      <p className="text-xs text-slate-500 mb-3">Send a secure password reset link to your registered email address.</p>
                      
                      {resetSent ? (
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Password reset email sent! Check your inbox.
                        </p>
                      ) : (
                        <button
                          onClick={async () => {
                            if (user?.email) {
                              await triggerPasswordReset(user.email);
                              setResetSent(true);
                            }
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Send Reset Link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      <CartDrawer />
      <QuickSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-bold">
        Loading user dashboard...
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
