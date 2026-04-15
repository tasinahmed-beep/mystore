#!/usr/bin/env node

import fetch from "node-fetch";

console.log("🧪 T Shop Bot Deployment Verification");
console.log("═".repeat(50));

const sites = [
  "https://tdigitalstore.web.app",
  "https://novel-db4b6.web.app"
];

async function testSite(baseUrl) {
  console.log(`\n🔍 Testing ${baseUrl}`);
  
  try {
    // Test health endpoint
    const healthUrl = `${baseUrl}/api/health`;
    console.log(`  📡 GET ${healthUrl}`);
    
    const response = await fetch(healthUrl, { 
      timeout: 5000,
      headers: { "User-Agent": "T-Shop-Bot-Verifier" }
    });
    
    if (!response.ok) {
      console.error(`  ❌ Health check failed: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`  ✅ Health check passed`);
    console.log(`     Service: ${data.service}`);
    console.log(`     Status: ${data.ok ? "RUNNING" : "DOWN"}`);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Connection failed: ${error.message}`);
    return false;
  }
}

async function testOrderEndpoint(baseUrl) {
  console.log(`\n📮 Testing order endpoint for ${baseUrl}`);
  
  try {
    const orderUrl = `${baseUrl}/api/send-order`;
    console.log(`  📡 POST ${orderUrl}`);
    
    const testOrder = {
      storeName: "T Shop",
      supportUsername: "tasinahmed2508",
      order: {
        id: "test-" + Date.now(),
        items: [
          {
            id: "github-student-4",
            name: "GitHub Student Verification",
            price: 4,
            quantity: 1
          }
        ],
        total: 4,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerTelegram: "@testuser",
        paymentMethod: "Binance"
      }
    };
    
    const response = await fetch(orderUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "T-Shop-Bot-Verifier"
      },
      body: JSON.stringify(testOrder),
      timeout: 5000
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log(`  ✅ Order endpoint working`);
      console.log(`     Message sent: ${data.ok}`);
      console.log(`     Chat ID: ${data.chatId ? data.chatId.toString().substring(0, 4) + "***" : "hidden"}`);
      return true;
    } else {
      console.error(`  ❌ Order send failed: ${data.error || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.error(`  ❌ Request failed: ${error.message}`);
    return false;
  }
}

async function run() {
  let allHealthy = true;
  
  for (const site of sites) {
    const healthy = await testSite(site);
    if (healthy) {
      const orderOk = await testOrderEndpoint(site);
      if (!orderOk) {
        console.warn(`  ⚠️  Health check passed but order endpoint has issues`);
        allHealthy = false;
      }
    } else {
      allHealthy = false;
    }
  }
  
  console.log("\n" + "═".repeat(50));
  if (allHealthy) {
    console.log("✅ All checks passed! Bot is running on Firebase.");
    console.log("\n🎯 Next steps:");
    console.log("  1. Visit https://tdigitalstore.web.app");
    console.log("  2. Add products to cart");
    console.log("  3. Checkout with your Telegram username");
    console.log("  4. Orders should appear in your Telegram chat");
  } else {
    console.log("⚠️  Some checks failed. Troubleshooting:");
    console.log("  1. Run: firebase deploy --only functions");
    console.log("  2. Check functions/.env.local has correct bot token");
    console.log("  3. Firebase logs: firebase functions:log");
  }
}

run().catch(console.error);
