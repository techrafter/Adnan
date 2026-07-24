import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
  StatusBar
} from 'react-native';

const STORE_LOCATION = "Shve Ada City";
const ADMIN_WHATSAPP_NUMBER = "+923348699487";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  unit: string;
  image: string;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: "p-101",
    name: "Adnan Select Biryani Spice Mix",
    price: 155,
    originalPrice: 260,
    unit: "100g Pack",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80",
    category: "Spices"
  },
  {
    id: "p-102",
    name: "Olper's Full Cream UHT Milk 1L",
    price: 290,
    originalPrice: 310,
    unit: "1 Liter",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80",
    category: "Dairy"
  },
  {
    id: "p-103",
    name: "Sunridge Fine Whole Wheat Atta",
    price: 1350,
    originalPrice: 1480,
    unit: "10 kg Bag",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    category: "Flour"
  },
  {
    id: "p-104",
    name: "Fresh Red Apples",
    price: 240,
    originalPrice: 280,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",
    category: "Fruits"
  }
];

export default function App() {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, q]) => {
    const item = PRODUCTS.find(p => p.id === id);
    return sum + (item ? item.price * q : 0);
  }, 0);

  const handleCheckout = () => {
    if (totalItems === 0) {
      Alert.alert("Cart Empty", "Please add items to cart before checkout.");
      return;
    }
    if (!customerName || !customerPhone || !address) {
      Alert.alert("Required Fields", "Please fill in your name, phone number, and Shve Ada delivery address.");
      return;
    }

    const itemDetails = Object.entries(cart).map(([id, q]) => {
      const p = PRODUCTS.find(prod => prod.id === id);
      return `${p?.name} x ${q} = Rs. ${(p?.price || 0) * q}`;
    }).join('\n');

    const whatsappPayload = `🛒 *NEW MOBILE APP ORDER - ADNAN SUPER STORE*
-----------------------------------------
👤 *Name:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *City:* ${STORE_LOCATION}
🏠 *Address:* ${address}

📦 *ITEMS:*
${itemDetails}

💰 *TOTAL AMOUNT:* Rs. ${totalAmount}
💳 *PAYMENT METHOD:* ${paymentMethod}
-----------------------------------------
Order placed via Adnan Super Store Android App.`;

    const url = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappPayload)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#00a950" />
      
      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandUrdu}>بازار</Text>
          <Text style={styles.brandEnglish}>ADNAN SUPER STORE</Text>
        </View>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 {STORE_LOCATION}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>ADNAN SELECT</Text>
          <Text style={styles.bannerTitle}>PREMIUM SPICES & GROCERIES</Text>
          <Text style={styles.bannerSubtitle}>Fast 30-min home delivery in Shve Ada City</Text>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search groceries, milk, atta in Shve Ada..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Product Grid */}
        <Text style={styles.sectionTitle}>Available Products</Text>
        <View style={styles.grid}>
          {PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(product => {
            const count = cart[product.id] || 0;
            return (
              <View key={product.id} style={styles.card}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.unit}>{product.unit}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs. {product.price}</Text>
                  <Text style={styles.originalPrice}>Rs. {product.originalPrice}</Text>
                </View>

                {count > 0 ? (
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={() => removeFromCart(product.id)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{count}</Text>
                    <TouchableOpacity onPress={() => addToCart(product.id)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => addToCart(product.id)} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ ADD</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Checkout Section */}
        {totalItems > 0 && (
          <View style={styles.checkoutBox}>
            <Text style={styles.checkoutTitle}>Checkout Details ({totalItems} items)</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (+92...)"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder={`Delivery Address in ${STORE_LOCATION}`}
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <Text style={styles.label}>Select Payment Method:</Text>
            <View style={styles.paymentRow}>
              {['EasyPaisa', 'JazzCash', 'COD'].map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setPaymentMethod(m)}
                  style={[styles.payChip, paymentMethod === m && styles.payChipActive]}
                >
                  <Text style={[styles.payChipText, paymentMethod === m && styles.payChipTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>Rs. {totalAmount}</Text>
            </View>

            <TouchableOpacity onPress={handleCheckout} style={styles.confirmBtn}>
              <Text style={styles.confirmBtnText}>Order via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0'
  },
  brandUrdu: { fontSize: 22, fontWeight: 'bold', color: '#00a950' },
  brandEnglish: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1, color: '#0f172a' },
  locationBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  locationText: { fontSize: 11, fontWeight: 'bold', color: '#00672e' },
  content: { padding: 16 },
  banner: {
    backgroundColor: '#054421',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  bannerTag: { color: '#fef08a', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  bannerSubtitle: { color: '#bbf7d0', fontSize: 11, marginTop: 2 },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  productImage: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'contain' },
  productName: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', marginTop: 6, height: 32 },
  unit: { fontSize: 10, color: '#64748b', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  originalPrice: { fontSize: 10, color: '#94a3b8', textDecorationLine: 'line-through', marginLeft: 4 },
  addBtn: { backgroundColor: '#00a950', paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#00a950', borderRadius: 20, padding: 2 },
  qtyBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  qtyText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  checkoutBox: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginTop: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  checkoutTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 12, marginBottom: 8 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#475569', marginTop: 4, marginBottom: 6 },
  paymentRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  payChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#f1f5f9' },
  payChipActive: { backgroundColor: '#00a950' },
  payChipText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  payChipTextActive: { color: '#ffffff' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, paddingTop: 10, borderTopWidth: 1, borderColor: '#f1f5f9' },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#00883e' },
  confirmBtn: { backgroundColor: '#00a950', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 }
});
