# Firebase Cloud Functions Bot Deployment

This directory contains the Telegram bot server for T Shop, configured to run on Firebase Cloud Functions.

## What This Does

- Deploys bot server to Firebase (same project as frontend)
- Bot API available at: `https://tdigitalstore.web.app/api/send-order`
- No separate server needed - everything on Firebase!
- Scales automatically with Firebase

## Setup

### Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

### Environment Variables

Edit `.env.local` with your credentials:
```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
```

### Deploy to Firebase

From root directory:

```bash
npm install  # Install main dependencies
cd functions
npm install  # Install functions dependencies
cd ..
npx firebase deploy
```

## Configuration

### firebase.json Rewrites

Requests to `/api/**` are automatically routed to the Cloud Function:

```json
{
  "rewrites": [
    {
      "source": "/api/**",
      "function": "botApi"
    }
  ]
}
```

### Frontend .env.local

```
VITE_BOT_API_URL=https://tdigitalstore.web.app/api
```

## API Endpoints (on Firebase)

### Health Check
```
GET https://tdigitalstore.web.app/api/health
```

### Send Order
```
POST https://tdigitalstore.web.app/api/send-order
Content-Type: application/json

{
  "storeName": "T Shop",
  "supportUsername": "tasinahmed2508",
  "order": { /* order object */ }
}
```

## Features

✅ Receives cart orders
✅ Sends to Telegram with rich formatting
✅ Sticker animations
✅ Auto-reply to messages
✅ Hosted on Firebase (no separate server)
✅ Same domain as frontend

## Testing

After deployment:

```bash
curl https://tdigitalstore.web.app/api/health
```

Should return:
```json
{
  "ok": true,
  "service": "T Shop Telegram Bot",
  "timestamp": "2026-04-15T..."
}
```

## Files

- `index.js` - Bot server code (Express + Telegram)
- `package.json` - Dependencies
- `.env.local` - Configuration

## Node Version

Cloud Functions uses Node.js 20 (specified in firebase.json)

## Cost

Firebase Cloud Functions:
- First 2M invocations/month: FREE
- Usage-based after that (very cheap)
- Perfect for small to medium shops

## Monitoring

View logs in Firebase Console:
- Project: novel-db4b6
- Functions: botApi
