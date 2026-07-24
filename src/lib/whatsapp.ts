import { Order } from '@/types';
import { ADMIN_WHATSAPP_NUMBER } from './mockData';

export function generateWhatsAppOrderUrl(order: Order, customPhone?: string): string {
  const targetPhone = (customPhone || ADMIN_WHATSAPP_NUMBER).replace(/[^0-9+]/g, '');

  const itemsListFormatted = order.items
    .map((item, index) => `${index + 1}. *${item.name}* (${item.unit}) x ${item.quantity} = Rs. ${item.price * item.quantity}`)
    .join('\n');

  const textPayload = `🛒 *NEW ORDER - ADNAN SUPER STORE*
----------------------------------------
📌 *Order ID:* #${order.id}
👤 *Customer Name:* ${order.customerName}
📞 *Phone Number:* ${order.customerPhone}
📍 *City:* ${order.city} (Exclusive)
🏠 *Delivery Address:* ${order.address}
${order.notes ? `📝 *Notes:* ${order.notes}\n` : ''}
📦 *ORDERED ITEMS:*
${itemsListFormatted}

----------------------------------------
💵 *Subtotal:* Rs. ${order.subtotal}
🏷️ *Discount:* Rs. ${order.discount}
🚚 *Delivery Fee:* Rs. ${order.deliveryFee}
💰 *TOTAL AMOUNT:* Rs. ${order.totalAmount}
💳 *Payment Method:* ${order.paymentMethod}
${order.receiptUrl ? `🧾 *Payment Receipt Screenshot:* \n${order.receiptUrl}` : '🧾 *Payment Receipt:* Cash on Delivery / Pending'}
----------------------------------------
Thank you for shopping at *Adnan Super Store (Shve Ada City)*! Please process my order.`;

  const encodedMessage = encodeURIComponent(textPayload);
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}
