# Running Bot Locally (Without Firebase Functions)

If you don't want to upgrade Firebase to Blaze plan, you can run the bot server locally on your machine.

## Quick Start

### 1. Install Dependencies

```bash
cd "telgram bot"
npm install
```

### 2. Verify Environment Variables

Check `.env.local` has your bot token and chat ID:

```bash
cat .env.local
```

Should show:
```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
```

### 3. Start Bot Server

```bash
npm start
```

You should see:
```
🤖 Bot initialized successfully
✅ Bot polling active
📞 Listening on port 5000
```

### 4. Update Frontend Environment

Go back to project root and **update `.env.local`**:

```bash
VITE_BOT_API_URL=http://localhost:5000/api
```

### 5. Build and Test

```bash
npm run build
npm run dev
```

Then visit `http://localhost:5173` and test cart checkout.

## How It Works

**Local Setup:**
```
Frontend (localhost:5173)
    ↓
.env.local: VITE_BOT_API_URL=http://localhost:5000/api
    ↓
Bot Server (localhost:5000)
    ↓
Telegram Bot API
    ↓
Your Chat (7773751516)
```

## Testing Orders Locally

1. Open http://localhost:5173 in browser
2. Add products to cart
3. Go to checkout
4. Enter name, email, Telegram username
5. Click "Send Order"
6. Order should appear in your Telegram chat within seconds

## Keep Bot Running

To keep bot running when you close terminal:

### Option A: npm-global-cli
```bash
npm install -g pm2
pm2 start "npm start" --cwd "telgram bot" --name t-shop-bot
pm2 save
pm2 startup
```

### Option B: Windows Task Scheduler
1. Create batch file `start-bot.bat`:
```batch
cd "d:\IUT\My shop\telgram bot"
npm start
```
2. Schedule in Windows Task Scheduler to run at startup

### Option C: Keep terminal open
Just leave the terminal window open with `npm start` running

## Sharing Local Bot (Network Only)

If you want to test from other machines on same WiFi:

1. Find your IP: `ipconfig` → IPv4 Address (e.g., `192.168.1.100`)
2. Update `.env.local` in root:
```
VITE_BOT_API_URL=http://192.168.1.100:5000/api
```
3. Both machines connect to: `http://192.168.1.100:5173`

## Stop Bot Server

Press `Ctrl+C` in the terminal running bot.

## Production Deployment

When ready to go live, choose ONE option:

**Option A: Firebase Blaze (EASIEST)**
- Upgrade Firebase to Blaze plan
- Run: `firebase deploy`
- Bot at: `https://tdigitalstore.web.app/api`

**Option B: Railway.app (FREE TIER)**
```bash
brew install railway  # or: npm install -g railway
cd "telgram bot"
railway link
railway up
```
Then use Railway URL in `.env.local`

**Option C: Render.com (FREE TIER)**
- Push code to GitHub
- Connect GitHub to Render
- Deploy automatically

## Troubleshooting

**Bot not receiving messages?**
1. Check bot token in `.env.local`
2. Check OWNER_CHAT_ID is correct
3. Look for errors: `npm start` output

**Orders not sending?**
1. Check frontend .env.local has correct API URL
2. Check CORS headers (should be enabled)
3. Run: `curl http://localhost:5000/api/health`

**Port 5000 already in use?**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID 1234 /F

# Or change bot port in telgram\ bot\server.js line 1
```

## Quick Commands

```bash
# Install bot dependencies
cd "telgram bot" && npm install

# Start bot locally
cd "telgram bot" && npm start

# Build frontend
npm run build

# Test bot health
curl http://localhost:5000/api/health

# View bot logs
npm run dev
```

## Files Involved

- `telgram bot/server.js` - Bot server code
- `telgram bot/.env.local` - Bot credentials
- `telgram bot/package.json` - Bot dependencies
- `.env.local` - Frontend API URL (points to bot)
- `src/App.tsx` - Sends orders to bot

## Next Steps

Choose your path:

1. **Want simplest solution?** → Upgrade to Blaze, run `firebase deploy`
2. **Want to test first?** → Run locally, use this guide
3. **Want free hosting?** → Deploy to Railway/Render (see separate guide)
