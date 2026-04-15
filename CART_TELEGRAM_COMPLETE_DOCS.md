# 🤝 T Shop Telegram & Cart Integration - Complete Documentation

## System Overview

T Shop has a fully integrated cart-to-Telegram order system that:
- ✅ Allows customers to add products and checkout
- ✅ Sends orders to Telegram with rich formatting
- ✅ Displays celebration stickers on order receipt
- ✅ Provides auto-replies to customer messages
- ✅ Includes fallback to manual Telegram link if API fails
- ✅ Persists all orders locally for tracking

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER BROWSER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React App (src/App.tsx)                             │   │
│  │  • Product listing                                   │   │
│  │  • Shopping cart (localStorage)                      │   │
│  │  • Checkout form                                     │   │
│  │  • Order tracking page                               │   │
│  └────────────┬──────────────────────────────────────┬──┘   │
└───────────────│──────────────────────────────────────│───────┘
                │                              API Request
                │                              (POST /send-order)
                │                                   │
                ▼                                   ▼
┌──────────────────────────────────────────────────────────────┐
│           NODE.JS TELEGRAM BOT SERVER                         │
│  (telgram bot/server.js)                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Express API                                         │     │
│  │  • /health - Health check                           │     │
│  │  • /send-order - Receive orders                     │     │
│  │  • /handle-messages - Auto-reply                    │     │
│  └────────────┬──────────────────────────┬─────────────┘     │
└───────────────│──────────────────────────│──────────────────┘
                │                          │
                │ REST API              Telegram
                │ (VITE_BOT_API_URL)    Bot API
                │                          │
                ▼                          ▼
         Firebase Hosting         Telegram Bot API
       (tdigitalstore.web.app)   (Node Telegram Bot)
                                       │
                                       ▼
                                  TELEGRAM CHAT
                                  (Owner receives
                                   formatted order)
```

---

## Data Flow

### Order Journey

```
1. PRODUCT PAGE
   └─ Customer views: GitHub Student ($4) or Teacher ($7)

2. ADD TO CART
   └─ Item stored in localStorage
   └─ Cart count updates

3. CHECKOUT PAGE
   ├─ Shows cart items with total
   ├─ Customer enters:
   │  ├─ Name
   │  ├─ Email
   │  └─ Telegram username
   └─ Selects payment method (Binance USDT)

4. PLACE ORDER
   ├─ Order created with unique code
   ├─ Order saved to localStorage
   └─ Order sent to bot API

5. BOT PROCESSES ORDER
   ├─ Validates order data
   ├─ Sends celebration sticker
   ├─ Formats message as HTML
   ├─ Sends to owner's Telegram chat
   └─ Returns success/failure

6. CUSTOMER REDIRECTED
   ├─ To order tracking page
   ├─ Shows order code
   ├─ Shows order status
   └─ Provides support link

7. AUTO-REPLY
   └─ Customer can message bot for support
      └─ Bot replies with welcome message
         └─ Links to store and products
```

---

## Products Configuration

### Current Products

| Product | Price | Warranty | Stock | Ban Policy |
|---------|-------|----------|-------|------------|
| GitHub Student Verification | $4 | 10 days | 100 | 1 month |
| GitHub Teacher Verification | $7 | 10 days | 100 | 1 month |

**File:** `src/data/products.json`

### Add New Products

Edit `products.json` and add:
```json
{
  "id": "unique-id",
  "name": "Product Name",
  "description": "Product description",
  "usdPrice": 10,
  "binancePrice": 10,
  "binanceCustomerPays": 10,
  "stock": 50,
  "totalStock": 100,
  "sold": 50,
  "logo": "url_to_logo",
  "localImage": "url_to_image",
  "warrantyDays": 10,
  "enriched": {
    "description": "...",
    "warranty": "...",
    "refund": "...",
    "notes": [],
    "useCases": []
  }
}
```

---

## Setup & Deployment

### Development Setup

1. **Frontend**
```bash
npm install
npm run dev
# Open http://localhost:5173
```

2. **Bot Server**
```bash
cd "telgram bot"
npm install
node server.js
# Bot listening on http://localhost:3001
```

3. **Create .env files**

Frontend `.env.local`:
```
VITE_BOT_API_URL=http://localhost:3001
```

Bot `telgram bot/.env.local`:
```
BOT_TOKEN=your_bot_token
OWNER_CHAT_ID=your_chat_id
GROUP_NAME=T Shop Support
STORE_URL=http://localhost:5173
PORT=3001
```

### Production Deployment

1. **Deploy Frontend**
```bash
npm run build
npx firebase deploy --only hosting
# Available at: https://tdigitalstore.web.app
```

2. **Deploy Bot Server**
- Deploy to: Heroku, Railway, VPS, or Cloud Run
- Update `VITE_BOT_API_URL` to bot server URL
- Rebuild and redeploy frontend

3. **Update Environment**
- Bot: `STORE_URL=https://tdigitalstore.web.app`
- Frontend: `VITE_BOT_API_URL=https://your-bot-api.com`

---

## Features Breakdown

### 🛒 Cart Features
- ✅ Add/remove products
- ✅ Adjust quantities
- ✅ Persistent storage (localStorage)
- ✅ Real-time total calculation
- ✅ Quantity badges in navigation

### 📝 Checkout Features
- ✅ Form validation
- ✅ Payment method selection (Binance)
- ✅ Customer information capture
- ✅ Order code generation
- ✅ Order persistence

### 💬 Telegram Features
- ✅ Rich HTML formatting
- ✅ Celebration sticker animation
- ✅ Product links
- ✅ Support contact link
- ✅ Auto-reply to messages
- ✅ 20-minute cooldown prevention
- ✅ Fallback to manual link

### 📊 Order Tracking
- ✅ Order history page
- ✅ Order details view
- ✅ Order status tracking
- ✅ Support contact button
- ✅ Unique order code

---

## API Endpoints

### Frontend → Bot API

**Health Check**
```
GET /health
Response: { "ok": true }
```

**Send Order**
```
POST /send-order
Content-Type: application/json

Request Body:
{
  "storeName": "T Shop",
  "supportUsername": "tasinahmed2508",
  "order": {
    "id": "order-id",
    "code": "ORD-2026-04-15-001",
    "createdAt": "2026-04-15T12:30:01Z",
    "customerName": "Ahmed Tasin",
    "customerEmail": "ahmed@example.com",
    "customerTelegram": "@tasinahmed",
    "paymentMethod": "binance",
    "paymentStatus": "pending",
    "deliveryStatus": "processing",
    "totalAmount": 15,
    "items": [
      {
        "productId": "github-student-4",
        "productName": "GitHub Student Verification - $4",
        "quantity": 2,
        "unitPrice": 4
      }
    ]
  }
}

Response:
{
  "ok": true
}

Error Response:
{
  "ok": false,
  "error": "Invalid order payload"
}
```

---

## Testing

### Run Local Demo
```bash
node demo-cart-flow.mjs
```

This shows:
- Product prices and stock
- Sample cart with items
- Checkout form data
- Order creation
- Telegram message format
- Order tracking

### Test Bot API
```bash
cd "telgram bot"
node test-api.mjs
```

This tests:
- Health endpoint
- Sample order sending
- Order format validation

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Orders not in Telegram | Bot API not running | Start bot: `node telgram bot/server.js` |
| API connection error | Wrong `VITE_BOT_API_URL` | Check `.env.local` configuration |
| Sticker not showing | Invalid sticker ID | Order still sends, sticker is optional |
| No auto-reply | Polling disabled | Restart bot server |
| Checkout form stuck | Missing fields | Fill all required fields |
| Orders not saving | localStorage disabled | Check browser settings |

---

## Files Reference

**Core Files:**
- `src/App.tsx` - Main app logic, cart, checkout
- `src/data/products.json` - Product catalog
- `telgram bot/server.js` - Telegram bot server
- `firebase.json` - Firebase configuration

**Configuration:**
- `.env.local` - Frontend environment (create from `.env.example`)
- `telgram bot/.env.local` - Bot environment (create from `telgram bot/.env.example`)

**Documentation:**
- `CART_TELEGRAM_QUICK_START.md` - Quick start guide
- `TELEGRAM_INTEGRATION.md` - Detailed setup
- `PUBLIC_POLICY.md` - Terms and policies

**Utilities:**
- `demo-cart-flow.mjs` - Order flow demonstration
- `telgram bot/test-api.mjs` - API testing
- `telgram bot/setup.sh` - Bot setup script (Unix)
- `telgram bot/setup.ps1` - Bot setup script (Windows)

---

## Key Decisions

✅ **localStorage for persistence** - No backend needed, works offline  
✅ **HTML formatting** - Rich messages with emojis and formatting  
✅ **Fallback mechanism** - Manual Telegram link if API fails  
✅ **Auto-reply cooldown** - Prevents spam (20 minutes)  
✅ **Fixed prices** - $4 and $7 no dynamic pricing  
✅ **10-day warranty** - Standard warranty period  
✅ **1-month ban policy** - Account eligibility enforcement  

---

## Next Steps

1. ✅ Set up Telegram bot (get token from @BotFather)
2. ✅ Create `.env.local` files with bot credentials
3. ✅ Test locally with bot server running
4. ✅ Deploy bot server to production
5. ✅ Update `VITE_BOT_API_URL` for production
6. ✅ Deploy frontend to Firebase
7. ✅ Test complete end-to-end flow

---

**Status:** ✅ COMPLETE  
**Last Updated:** April 15, 2026  
**Components:** React Frontend + Node.js Bot + Firebase Hosting  
**Payment:** Binance (USDT)  
**Support:** Telegram @tasinahmed2508
