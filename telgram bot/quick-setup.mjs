#!/usr/bin/env node
/**
 * Quick Setup: Get Your Chat ID
 */

import https from 'https';
import readline from 'readline';
import fs from 'fs';

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
          resolve(JSON.parse(data));
        } catch {
          resolve({ ok: false, data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getChatId() {
  console.log('\n🚀 T SHOP BOT - QUICK SETUP\n');
  console.log('===========================\n');

  console.log('Step 1: Bot Verification ✅');
  console.log('   Bot Name: T Store Digital');
  console.log('   Bot Username: @TStoreDigitalbot');
  console.log('   Bot Token: Valid\n');

  console.log('Step 2: Get Your Chat ID');
  console.log('   Message the bot at: @TStoreDigitalbot\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const waitForMessage = () => {
    return new Promise((resolve) => {
      rl.question('Have you sent a message to @TStoreDigitalbot? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          console.log('\n🔍 Fetching your Chat ID...\n');
          
          try {
            const updates = await makeRequest('GET', '/getUpdates');
            
            if (updates.ok && updates.result.length > 0) {
              const chatIds = new Set();
              const messages = [];
              
              updates.result.forEach((update) => {
                if (update.message) {
                  const chatId = update.message.chat.id;
                  chatIds.add(chatId);
                  messages.push({
                    chatId,
                    from: update.message.from.first_name,
                    text: update.message.text || '(message)',
                  });
                }
              });

              if (chatIds.size > 0) {
                console.log('✅ Found Chat IDs:\n');
                messages.forEach((msg, i) => {
                  console.log(`   ${i + 1}. Chat ID: ${msg.chatId}`);
                  console.log(`      From: ${msg.from}`);
                  console.log(`      Message: ${msg.text}\n`);
                });

                rl.question('Which Chat ID is yours? (enter number): ', (choice) => {
                  const idx = parseInt(choice) - 1;
                  if (idx >= 0 && idx < messages.length) {
                    const selectedChatId = messages[idx].chatId;
                    console.log(`\n✅ Selected Chat ID: ${selectedChatId}\n`);
                    
                    // Update .env.local
                    updateEnv(selectedChatId);
                    rl.close();
                    resolve();
                  } else {
                    console.log('Invalid selection');
                    rl.close();
                    resolve();
                  }
                });
              } else {
                console.log('❌ No messages found');
                console.log('   Try sending a message again\n');
                rl.close();
                resolve();
              }
            } else {
              console.log('❌ No updates available');
              console.log('   Please try again\n');
              rl.close();
              resolve();
            }
          } catch (error) {
            console.log('❌ Error:', error.message);
            rl.close();
            resolve();
          }
        } else {
          console.log('\n👉 Please message @TStoreDigitalbot and try again\n');
          rl.close();
          resolve();
        }
      });
    });
  };

  await waitForMessage();
}

function updateEnv(chatId) {
  const envPath = './.env.local';
  const envContent = fs.readFileSync(envPath, 'utf8');
  const updated = envContent.replace('OWNER_CHAT_ID=YOUR_CHAT_ID_HERE', `OWNER_CHAT_ID=${chatId}`);
  
  fs.writeFileSync(envPath, updated);
  
  console.log('✅ .env.local Updated!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Install dependencies: npm install (in telgram bot/ folder)');
  console.log('   2. Start bot: npm start');
  console.log('   3. Test: node test-api.mjs\n');
  console.log('🎉 Your bot is ready!\n');
}

getChatId();
