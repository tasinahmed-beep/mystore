#!/usr/bin/env node
/**
 * Telegram Bot Token Validator
 */

import https from 'https';

const BOT_TOKEN = '8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4';

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}${path}`;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
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
    req.end();
  });
}

async function testBot() {
  console.log('🤖 TELEGRAM BOT TOKEN VALIDATOR\n');
  console.log('================================\n');
  
  console.log(`Testing Token: ${BOT_TOKEN.substring(0, 20)}...`);
  console.log('');

  try {
    // Test 1: Get bot info
    console.log('📋 Test 1: Get Bot Information');
    const botInfo = await makeRequest('GET', '/getMe');
    
    if (botInfo.status === 200 && botInfo.data.ok) {
      const bot = botInfo.data.result;
      console.log('✅ PASS: Bot token is valid!');
      console.log(`   Bot Name: ${bot.first_name}`);
      console.log(`   Bot Username: @${bot.username}`);
      console.log(`   Bot ID: ${bot.id}`);
      console.log(`   Is Bot: ${bot.is_bot}`);
    } else {
      console.log('❌ FAIL: Invalid bot token');
      console.log('   Error:', botInfo.data.description);
    }
    console.log('');

    // Test 2: Get updates to find chat ID
    console.log('📋 Test 2: Get Updates (to find Chat ID)');
    const updates = await makeRequest('GET', '/getUpdates');
    
    if (updates.status === 200 && updates.data.ok) {
      if (updates.data.result.length > 0) {
        console.log('✅ Found messages:');
        const chatIds = new Set();
        updates.data.result.forEach((update, i) => {
          if (update.message) {
            const chatId = update.message.chat.id;
            chatIds.add(chatId);
            console.log(`   Update ${i + 1}:`);
            console.log(`   - Chat ID: ${chatId}`);
            console.log(`   - From: ${update.message.from.first_name}`);
            console.log(`   - Text: ${update.message.text || '(no text)'}`);
          }
        });
        console.log('');
        console.log('📝 Use this Chat ID in .env.local:');
        chatIds.forEach(id => {
          console.log(`   OWNER_CHAT_ID=${id}`);
        });
      } else {
        console.log('⚠️  No messages yet');
        console.log('   Steps to get Chat ID:');
        console.log('   1. Send a message to your bot');
        console.log('   2. Run this test again');
      }
    } else {
      console.log('❌ Failed to get updates:', updates.data.description);
    }
    console.log('');

    // Test 3: Check webhook status
    console.log('📋 Test 3: Webhook Status');
    const webhook = await makeRequest('GET', '/getWebhookInfo');
    
    if (webhook.status === 200 && webhook.data.ok) {
      const info = webhook.data.result;
      if (info.url) {
        console.log('⚠️  Webhook configured:');
        console.log(`   URL: ${info.url}`);
        console.log('   Consider setting polling mode for local development');
      } else {
        console.log('✅ No webhook - using polling mode (good for local dev)');
      }
    }
    console.log('');

    // Summary
    console.log('═════════════════════════════════════\n');
    if (botInfo.data.ok) {
      console.log('✅ BOT TOKEN IS VALID!\n');
      console.log('📝 Configuration Steps:');
      console.log('1. Create telgram bot/.env.local');
      console.log(`2. Add: BOT_TOKEN=${BOT_TOKEN}`);
      console.log('3. Add: OWNER_CHAT_ID=<your_chat_id>');
      console.log('4. Send a message to:');
      console.log(`   @${botInfo.data.result.username}`);
      console.log('5. Run this test again to get your Chat ID');
      console.log('6. Start bot: node telgram bot/server.js');
    } else {
      console.log('❌ BOT TOKEN IS INVALID\n');
      console.log('Please verify:');
      console.log('1. Token is correctly copied');
      console.log('2. No extra spaces or characters');
      console.log('3. Token is still valid (not expired)');
    }
    console.log('');

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('\nPossible issues:');
    console.log('- Internet connection problem');
    console.log('- Telegram API unreachable');
    console.log('- Bot token invalid or malformed');
  }
}

testBot();
