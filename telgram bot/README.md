# 🤖 T Shop Telegram Bot (Python)

Python-based Telegram bot service that auto-replies to messages with store visit link.

**Bot:** @TStoreDigitalbot | **Token Status:** ✅ VERIFIED & ACTIVE

## Quick Start

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

Edit `.env.local`:
```
TELEGRAM_BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
```

### 3. Run Bot Locally

```bash
python bot.py
```

## Configuration

### Environment Variables (`.env.local`)

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### Store Link

Default store link: `https://t.me/tstoredigital25`
(Edit this in `bot.py` if needed)

## Features

✅ Rich HTML formatted order messages
✅ Celebration stickers on order receipt
✅ Auto-reply to customer messages
✅ 20-minute cooldown on auto-replies
✅ Clickable product links
✅ Support contact link
✅ Order code tracking

## API Endpoints

### Health Check
```
GET /health
Response: { "ok": true }
```

### Send Order
```
POST /send-order
Content-Type: application/json

Body: {
  "storeName": "T Shop",
  "supportUsername": "tasinahmed2508",
  "order": { /* Order object */ }
}

Response: { "ok": true }
```

## Testing

```bash
# Test bot token
node test-bot-token.mjs

# Get Chat ID
node quick-setup.mjs

# Test API endpoints
node test-api.mjs
```

## Docker Deployment

Run bot in Docker container for easy deployment and isolation.

### Quick Start with docker-compose

```bash
# Interactive setup (creates .env file)
node docker-helper.mjs setup

# Start bot container
node docker-helper.mjs up

# View logs
node docker-helper.mjs logs

# Test bot
node docker-helper.mjs test
```

### Manual Docker Commands

```bash
# Build image
docker build -t t-shop-bot:latest .

# Run container
docker run -d \
  -p 3001:3001 \
  -e BOT_TOKEN=your_token \
  -e OWNER_CHAT_ID=your_chat_id \
  --name t-shop-bot \
  t-shop-bot:latest

# View logs
docker logs -f t-shop-bot
```

**For complete Docker guide, see [DOCKER.md](DOCKER.md)**

Helper script commands:
- `node docker-helper.mjs setup` - Interactive setup
- `node docker-helper.mjs build` - Build image
- `node docker-helper.mjs up` - Start container
- `node docker-helper.mjs down` - Stop container
- `node docker-helper.mjs logs` - View logs
- `node docker-helper.mjs test` - Test bot

## Frontend Integration

Frontend should send POST requests to `/send-order` with order data.

Set `VITE_BOT_API_URL` environment variable:
```
VITE_BOT_API_URL=http://localhost:3001
```

Or for production:
```
VITE_BOT_API_URL=https://your-bot-api.com
```

Set this in the frontend environment:

```bash
VITE_BOT_API_URL=http://localhost:3001
```
