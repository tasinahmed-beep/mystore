# 🛒 T Shop Cart & Telegram Integration - Quick Start

## What You Need to Know

### How Orders Get to Telegram

1. **Customer adds items to cart**
   - Uses "Add to Cart" button on product
   - Items stored in browser localStorage

2. **Customer goes to checkout**
   - Reviews items and quantities
   - Selects payment method (Binance USDT)

3. **Customer fills checkout form**
   - Name
   - Email
   - Telegram/WhatsApp username

4. **Customer clicks "Place Order"**
   - Order is created with unique code
   - Order saved in browser
   - Order sent to Telegram bot API

5. **Bot receives order**
   - Sends celebration sticker 🎉
   - Sends rich HTML formatted message
   - Shows all order details
   - Includes product links

6. **Customer gets order tracking link**
   - Can track order status
   - Can view order details
   - Can contact support via Telegram link

---

## Testing the Integration

### Quick Test (Local Development)

1. **Start the bot server in terminal 1:**
```bash
cd "telgram bot"
npm install
node server.js
```
You should see: `Telegram bot service listening on 3001`

2. **Start frontend dev server in terminal 2:**
```bash
npm run dev
```

3. **Test the cart:**
   - Open http://localhost:5173
   - Add some products to cart
   - Go to checkout
   - Fill in your details:
     - Name: Your Name
     - Email: your@email.com
     - Telegram: @yourusername
   - Click "Place Order"
   - Order should appear in Telegram (if bot configured)

---

## Order Message Contains

✅ Order header with celebration emoji
✅ Customer details (name, email, contact)
✅ Order code (unique identifier)
✅ Payment method indicator (🪙 for Crypto)
✅ Total price in USD
✅ Product details:
   - Product name
   - Quantity ordered
   - Unit price
   - Direct link to product
✅ Support contact (clickable Telegram link)
✅ Processing status

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, cart logic, checkout form |
| `telgram bot/server.js` | Bot API server, message formatting |
| `src/data/products.json` | Product data (GitHub Student $4, Teacher $7) |
| `firebase.json` | Firebase deployment config |

---

## Environment Variables

### Frontend (.env.local)
```
VITE_BOT_API_URL=http://localhost:3001
```

### Bot Server (telgram bot/.env.local)
```
BOT_TOKEN=your_bot_token
OWNER_CHAT_ID=your_chat_id
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
PORT=3001
```

---

## Current Features

✅ Rich HTML formatted messages
✅ Celebration sticker on orders
✅ Auto-reply to customer messages
✅ 20-minute cooldown on replies
✅ Product links in messages
✅ Support contactable via Telegram
✅ Order code in message
✅ Payment method displayed
✅ Fallback to manual Telegram link
✅ Local order persistence

---

## Common Issues & Fixes

### Orders not appearing in Telegram
**Check:**
- Is bot server running? (`node telgram bot/server.js`)
- Is `VITE_BOT_API_URL` set correctly?
- Is bot token valid?
- Is chat ID correct?

### Sticker not showing
- Sticker is optional, order still sends
- This happens if sticker ID is invalid or API limits

### No response when messaging bot
- Check bot polling is active
- Verify message handler in server.js
- Check cooldown (20 min between auto-replies)

### Checkout form not submitting
- Fill all required fields
- Check browser console for errors
- Ensure valid email format

---

## Deployment Checklist

- [ ] Bot server deployed (Heroku/Railway/VPS)
- [ ] `VITE_BOT_API_URL` points to deployed bot
- [ ] Firebase hosting updated
- [ ] Bot token updated in production env
- [ ] Chat ID updated for production
- [ ] Store URL set to production domain
- [ ] `.env.local` files created (not committed)
- [ ] Products.json has correct prices ($4 & $7)

---

## Next Steps

1. Get Telegram bot token from @BotFather
2. Create .env.local files
3. Start bot server locally
4. Test checkout flow
5. Deploy bot server
6. Update production URLs
7. Deploy frontend to Firebase

---

For detailed setup: See `TELEGRAM_INTEGRATION.md`  
For API docs: See `telgram bot/README.md` (if available)
