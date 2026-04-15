#!/usr/bin/env node
/**
 * T Shop Telegram Integration Tester
 * Tests the bot API endpoints and order delivery
 */

import https from 'https';
import http from 'http';

const API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
const BOT_TOKEN = process.env.BOT_TOKEN || 'test-token';
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID || '123456';

console.log('🧪 T Shop Telegram Integration Tester');
console.log('=====================================');
console.log('');
console.log(`Testing Bot API at: ${API_URL}`);
console.log('');

// Utility to make requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(path, API_URL);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test 1: Health Check
async function testHealth() {
  console.log('📋 Test 1: Health Check');
  try {
    const result = await makeRequest('GET', '/health');
    if (result.status === 200 && result.data.ok) {
      console.log('✅ PASS: Bot API is healthy');
    } else {
      console.log('❌ FAIL: Health check returned:', result);
    }
  } catch (error) {
    console.log('❌ FAIL: Could not connect to bot API');
    console.log('   Error:', error.message);
  }
  console.log('');
}

// Test 2: Send Test Order
async function testSendOrder() {
  console.log('📋 Test 2: Send Test Order');
  
  const testOrder = {
    id: 'test-order-001',
    code: 'ORD-TEST-001',
    createdAt: new Date().toISOString(),
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerTelegram: '@testuser',
    paymentMethod: 'binance',
    paymentStatus: 'pending',
    deliveryStatus: 'processing',
    totalAmount: 25.50,
    items: [
      {
        productId: 'github-student-4',
        productName: 'GitHub Student Verification - $4',
        quantity: 2,
        unitPrice: 4,
      },
      {
        productId: 'github-teacher-7',
        productName: 'GitHub Teacher Verification - $7',
        quantity: 1,
        unitPrice: 7,
      },
    ],
  };

  try {
    const result = await makeRequest('POST', '/send-order', {
      storeName: 'T Shop',
      supportUsername: 'tasinahmed2508',
      order: testOrder,
    });

    if (result.status === 200 && result.data.ok) {
      console.log('✅ PASS: Order sent successfully');
      console.log(`   Order Code: ${testOrder.code}`);
      console.log(`   Total: $${testOrder.totalAmount}`);
      console.log(`   Items: ${testOrder.items.length}`);
    } else {
      console.log('❌ FAIL: Order send returned error:', result.data);
    }
  } catch (error) {
    console.log('❌ FAIL: Could not send order');
    console.log('   Error:', error.message);
  }
  console.log('');
}

// Test 3: Validate Order Format
async function testOrderFormat() {
  console.log('📋 Test 3: Validate Order Format');
  
  const minimalOrder = {
    code: 'ORD-MIN-001',
    items: [
      {
        productId: 'test-1',
        productName: 'Test Product',
        quantity: 1,
        unitPrice: 10,
      },
    ],
  };

  try {
    const result = await makeRequest('POST', '/send-order', {
      storeName: 'T Shop',
      supportUsername: 'test',
      order: minimalOrder,
    });

    if (result.status === 200 && result.data.ok) {
      console.log('✅ PASS: Minimal order format accepted');
    } else if (result.status === 400) {
      console.log('⚠️  Expected: Invalid order caught by validation');
    } else {
      console.log('❌ FAIL: Unexpected response:', result);
    }
  } catch (error) {
    console.log('⚠️  WARN: Order format test connection failed:', error.message);
  }
  console.log('');
}

// Run all tests
async function runTests() {
  console.log('Starting tests...');
  console.log('');
  
  await testHealth();
  await testSendOrder();
  await testOrderFormat();
  
  console.log('✅ Tests completed!');
  console.log('');
  console.log('📝 Next Steps:');
  console.log('1. Check Telegram chat for test order');
  console.log('2. Verify order formatting and sticker');
  console.log('3. Test auto-reply by messaging the bot');
  console.log('4. Verify product links are clickable');
}

runTests().catch(console.error);
