#!/usr/bin/env node
/**
 * HOW TO GET YOUR CHAT ID
 * Step-by-step guide
 */

console.log('\n📋 HOW TO GET YOUR TELEGRAM CHAT ID\n');
console.log('====================================\n');

console.log('✅ AUTOMATIC METHOD (Easiest)\n');
console.log('Step 1: Message the bot');
console.log('  • Open Telegram');
console.log('  • Search: @TStoreDigitalbot');
console.log('  • Send any message (e.g., "Hello")\n');

console.log('Step 2: Run automatic setup');
console.log('  cd "telgram bot"');
console.log('  node quick-setup.mjs\n');

console.log('Step 3: Follow prompts');
console.log('  • Answer: yes (have you messaged the bot)');
console.log('  • Select: which chat ID is yours\n');

console.log('✅ Your Chat ID will be automatically saved!\n');

console.log('═════════════════════════════════════\n');

console.log('📖 MANUAL METHOD\n');
console.log('Step 1: Message the bot');
console.log('  • Search: @TStoreDigitalbot');
console.log('  • Send any message\n');

console.log('Step 2: Get updates');
console.log('  node test-bot-token.mjs\n');

console.log('Step 3: Look for Chat ID in output');
console.log('  Output will show:');
console.log('  ┌──────────────────────────┐');
console.log('  │ Found Chat IDs:          │');
console.log('  │ 1. Chat ID: 123456789    │');
console.log('  │    From: Your Name       │');
console.log('  └──────────────────────────┘\n');

console.log('Step 4: Copy your Chat ID');
console.log('  Example: 123456789\n');

console.log('Step 5: Edit telgram bot/.env.local');
console.log('  Change this:');
console.log('    OWNER_CHAT_ID=YOUR_CHAT_ID_HERE');
console.log('  To this:');
console.log('    OWNER_CHAT_ID=123456789\n');

console.log('═════════════════════════════════════\n');

console.log('❓ WHAT IS CHAT ID?\n');
console.log('Chat ID = Your unique Telegram identifier');
console.log('Example: 123456789 (just a number)\n');

console.log('WHERE TO USE IT?\n');
console.log('File: telgram bot/.env.local');
console.log('Line: OWNER_CHAT_ID=123456789\n');

console.log('WHY NEEDED?\n');
console.log('Bot uses it to know where to send:');
console.log('  • Order notifications');
console.log('  • Customer messages');
console.log('  • System alerts\n');

console.log('═════════════════════════════════════\n');

console.log('🚀 TRY NOW:\n');
console.log('  1. Message @TStoreDigitalbot');
console.log('  2. Run: node telgram\ bot/quick-setup.mjs');
console.log('  3. Follow prompts\n');

console.log('✅ Done! Your Chat ID will be saved.\n');
