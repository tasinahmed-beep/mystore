# T Shop - Telegram Cart Integration Guide

## Overview
The cart system sends orders to Telegram in real-time with rich formatting, emojis, stickers, and direct product links.

## How It Works

### 1. Purchase Flow
```
Add to Cart → Checkout → Fill Form → Submit Order → Send to Telegram → Track Order
```

### 2. Order Submission Process
When a customer completes checkout:
1. Order is created with unique order code
2. Order data is saved locally
3. Order is sent to Telegram bot API
4. Rich HTML formatted message displays in Telegram
5. Celebratory sticker is sent
6. Customer is redirected to order tracking page

### 3. Telegram Bot Features

#### Order Notifications
- **Sticker Animation**: Celebratory sticker on order receive
- **Rich Formatting**: Bold titles, italics, code blocks
- **Customer Details**: Name, email, Telegram/WhatsApp contact
- **Order Summary**: Order code, payment method, total price
- **Product Details**: Product names, quantities, unit prices, direct links
- **Support Contact**: Clickable Telegram link to support

#### Auto-Reply to Messages
- **Welcome Message**: Friendly greeting with shop links
- **Response Time**: 20-minute estimated response
- **Auto-Reply Cooldown**: Only replies once per customer per 20 minutes

## Setup Instructions

### Step 1: Create Telegram Bot
1. Message @BotFather on Telegram
2. Create a new bot: `/newbot`
3. Follow instructions to set bot name and username
4. Copy your BOT_TOKEN (keep secret!)

### Step 2: Get Your Chat ID
1. Message your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your chat ID in the response
4. This is your OWNER_CHAT_ID

### Step 3: Environment Setup

Create `.env.local` file in the `telgram bot/` directory:
```
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
OWNER_CHAT_ID=YOUR_CHAT_ID_HERE
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
PORT=3001
```

### Step 4: Start Bot Server
```bash
cd "telgram bot"
npm install
npm start
```

### Step 5: Configure Frontend
Create `.env.local` in root directory:
```
VITE_BOT_API_URL=http://localhost:3001
```

For production, update to your bot server URL:
```
VITE_BOT_API_URL=https://your-bot-server.com
```

## Order Message Example

```
🛍️ 🎯 T Shop NEW ORDER 🎉

👤 CUSTOMER DETAILS 📋
📛 Name: John Doe
📧 Email: john@example.com
💬 Telegram/WhatsApp: @johndoe

📦 ORDER SUMMARY 💳
🆔 Order Code: ORD-2026-04-15-0001
💰 Payment Method: 🪙 Crypto (USDT)
💵 Total: $25.00

🧾 PRODUCTS 📦
1. GitHub Student Verification - $4
   ➡️ Quantity: 2x
   ➡️ Unit Price: $4.00
   🔗 View Product

2. GitHub Teacher Verification - $7
   ➡️ Quantity: 1x
   ➡️ Unit Price: $7.00
   🔗 View Product

━━━━━━━━━━━━━━━━━━━━━
📬 SUPPORT: @tasinahmed2508
⏰ Status: ✅ Order Received & Processing
```

## Fallback Mechanism
If the bot API is unavailable:
1. Order still saves locally
2. Telegram link opens in browser
3. Customer can manually send order details
4. Order remains trackable in system

## Features

### ✅ Current Implementation
- Order notifications with rich formatting
- Sticker animations
- HTML formatting (bold, italics, code blocks)
- Clickable links to products and support
- Auto-reply to customer messages
- 20-minute cooldown on auto-replies
- Fallback to manual Telegram link

### 📦 Product Information
- Product name
- Quantity ordered
- Unit price
- Direct product link (with anchor)
- Payment method indicator

### 🛡️ Reliability
- Try/catch error handling
- Optional sticker fallback
- Local order persistence
- Manual Telegram link backup

## Troubleshooting

### Bot Not Receiving Orders
1. Check BOT_TOKEN is correct
2. Verify OWNER_CHAT_ID is set
3. Ensure bot has permission to send messages
4. Test with `/health` endpoint

### Orders Not Appearing in Chat
1. Verify bot is in correct chat/group
2. Check bot permissions in group settings
3. Ensure HTML parsing is enabled
4. Check for API errors in server logs

### Auto-Reply Not Working
1. Bot must be in polling mode
2. Check message handler is active
3. Verify cooldown period (20 min)
4. Test by sending message to bot

## API Endpoints

### Health Check
```
GET /health
Response: { "ok": true }
```

### Send Order
```
POST /send-order
Body: {
  "storeName": "T Shop",
  "supportUsername": "tasinahmed2508",
  "order": { /* Order object */ }
}
Response: { "ok": true } or error
```

## Cart Component Integration

### Checkout Form Fields
- `customerName`: Full name of buyer
- `customerEmail`: Email address
- `customerTelegram`: Telegram username (@username format)

### Order Creation
```typescript
const order = {
  id: string,
  code: string,
  createdAt: ISO timestamp,
  customerName: string,
  customerEmail: string,
  customerTelegram: string,
  paymentMethod: "binance",
  paymentStatus: "pending",
  deliveryStatus: "processing",
  totalAmount: number,
  items: [{
    productId: string,
    productName: string,
    quantity: number,
    unitPrice: number
  }]
}
```

## Testing Checklist

- [ ] Bot receives order notifications
- [ ] Sticker displays correctly
- [ ] Rich formatting shows properly
- [ ] Product links are clickable
- [ ] Support link directs to Telegram
- [ ] Order code is correct
- [ ] Payment method displays with emoji
- [ ] Auto-reply triggers on message
- [ ] Cooldown prevents spam replies
- [ ] Fallback opens Telegram manual link

---

**Last Updated:** April 15, 2026  
**Bot Service:** Node.js + Express + node-telegram-bot-api  
**Frontend:** React + Vite  
**Payment Methods:** Binance (USDT)
