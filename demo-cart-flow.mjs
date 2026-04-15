#!/usr/bin/env node
/**
 * T Shop - Cart to Telegram Demo
 * Demonstrates the complete order flow
 */

import fs from 'fs';

console.log('\n🎬 T SHOP CART TO TELEGRAM FLOW DEMO\n');
console.log('=====================================\n');

// Load products
const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const githubStudent = products.find(p => p.id === 'github-student-4');
const githubTeacher = products.find(p => p.id === 'github-teacher-7');

console.log('📦 STEP 1: AVAILABLE PRODUCTS\n');
console.log(`  GitHub Student Verification: $${githubStudent.usdPrice}`);
console.log(`    → Warranty: ${githubStudent.warrantyDays} days`);
console.log(`    → Stock: ${githubStudent.stock}`);
console.log('');
console.log(`  GitHub Teacher Verification: $${githubTeacher.usdPrice}`);
console.log(`    → Warranty: ${githubTeacher.warrantyDays} days`);
console.log(`    → Stock: ${githubTeacher.stock}`);
console.log('');

console.log('🛒 STEP 2: CUSTOMER BUILDS CART\n');
const cart = [
  { productId: 'github-student-4', quantity: 2 },
  { productId: 'github-teacher-7', quantity: 1 },
];
console.log('  Cart Items:');
let cartTotal = 0;
cart.forEach(item => {
  const product = products.find(p => p.id === item.productId);
  const itemTotal = product.binancePrice * item.quantity;
  cartTotal += itemTotal;
  console.log(`    • ${product.name} x${item.quantity} = $${itemTotal}`);
});
console.log(`\n  💰 Cart Total: $${cartTotal}`);
console.log('');

console.log('📝 STEP 3: CHECKOUT FORM\n');
const checkout = {
  customerName: 'Ahmed Tasin',
  customerEmail: 'ahmed@example.com',
  customerTelegram: '@tasinahmed',
  paymentMethod: 'binance',
};
console.log(`  Name: ${checkout.customerName}`);
console.log(`  Email: ${checkout.customerEmail}`);
console.log(`  Telegram: ${checkout.customerTelegram}`);
console.log(`  Payment: ${checkout.paymentMethod.toUpperCase()}`);
console.log('');

console.log('✅ STEP 4: ORDER CREATED\n');
const now = new Date();
const orderCode = `ORD-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-001`;
const order = {
  id: 'order-' + Date.now(),
  code: orderCode,
  createdAt: new Date().toISOString(),
  customerName: checkout.customerName,
  customerEmail: checkout.customerEmail,
  customerTelegram: checkout.customerTelegram,
  paymentMethod: checkout.paymentMethod,
  paymentStatus: 'pending',
  deliveryStatus: 'processing',
  totalAmount: cartTotal,
  items: [
    {
      productId: 'github-student-4',
      productName: githubStudent.name,
      quantity: 2,
      unitPrice: githubStudent.binancePrice,
    },
    {
      productId: 'github-teacher-7',
      productName: githubTeacher.name,
      quantity: 1,
      unitPrice: githubTeacher.binancePrice,
    },
  ],
};
console.log(`  Order Code: ${order.code}`);
console.log(`  Status: ${order.paymentStatus}`);
console.log(`  Created: ${new Date(order.createdAt).toLocaleString()}`);
console.log('');

console.log('🚀 STEP 5: TELEGRAM MESSAGE\n');
console.log('  This message is sent to Telegram:\n');
console.log('  ┌─────────────────────────────────────┐');
const telegramMessage = [
  `🛍️ 🎯 T Shop NEW ORDER 🎉`,
  '',
  `👤 CUSTOMER DETAILS 📋`,
  `📛 Name: ${order.customerName}`,
  `📧 Email: ${order.customerEmail}`,
  `💬 Telegram: ${order.customerTelegram}`,
  '',
  `📦 ORDER SUMMARY 💳`,
  `🆔 Order Code: ${order.code}`,
  `💰 Payment: 🪙 Crypto (USDT)`,
  `💵 Total: $${order.totalAmount}`,
  '',
  `🧾 PRODUCTS 📦`,
];
order.items.forEach((item, i) => {
  telegramMessage.push(`${i + 1}. 📱 ${item.productName}`);
  telegramMessage.push(`   ➡️ Quantity: ${item.quantity}x`);
  telegramMessage.push(`   ➡️ Price: $${item.unitPrice}`);
});
telegramMessage.push('');
telegramMessage.push(`📬 SUPPORT: @tasinahmed2508`);
telegramMessage.push(`⏰ Status: ✅ Order Received`);

telegramMessage.forEach(line => {
  console.log(`  │ ${line}`);
});
console.log('  └─────────────────────────────────────┘');
console.log('');

console.log('🎉 STEP 6: FEATURES\n');
console.log('  ✅ Rich HTML formatting');
console.log('  ✅ Celebration sticker');
console.log('  ✅ Product links clickable');
console.log('  ✅ Customer contacted via Telegram');
console.log('  ✅ Order saved locally');
console.log('  ✅ Support link provided');
console.log('');

console.log('📊 STEP 7: ORDER TRACKING\n');
console.log(`  Order Link: /#order/${order.code}`);
console.log(`  Status: ${order.deliveryStatus.toUpperCase()}`);
console.log(`  Payment: ${order.paymentStatus.toUpperCase()}`);
console.log('');

console.log('═════════════════════════════════════════\n');
console.log('✨ FLOW COMPLETE!\n');
console.log('Current Implementation:');
console.log(`  • GitHub Student: $${githubStudent.binancePrice}`);
console.log(`  • GitHub Teacher: $${githubTeacher.binancePrice}`);
console.log(`  • Total Products: ${products.length}`);
console.log(`  • Warranty: ${githubStudent.warrantyDays} days`);
console.log(`  • Account Ban Policy: 1 month\n`);
