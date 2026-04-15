# Understanding Ports - T Shop Bot

## What is a Port?

A **port** is a communication endpoint that allows applications to receive data over a network. Think of it as a "door number" on a server.

### Analogy
```
Your Server = Building
├── Port 80 = Main entrance (HTTP websites)
├── Port 443 = Secure entrance (HTTPS websites)
├── Port 22 = Service entrance (SSH/terminal access)
└── Port 3001 = Side door (Your bot application) ✅
```

---

## Why Port 3001 for T Shop Bot?

| Reason | Explanation |
|--------|-------------|
| **Not reserved** | System doesn't use this port by default |
| **Safe range** | Ports 3000-3999 are for development/apps |
| **Standard** | Node.js developers commonly use 3000+ |
| **No conflicts** | Won't interfere with other services |
| **Easy to remember** | Close to 3000, easy for developers |

---

## Common Port Usage

| Port | Used By | Can we use? |
|------|---------|-----------|
| 21 | FTP (File Transfer) | ❌ Reserved |
| 22 | SSH (Terminal) | ❌ Reserved |
| 80 | HTTP (Websites) | ⚠️ Often taken |
| 443 | HTTPS (Secure sites) | ⚠️ Often taken |
| 3000 | Node dev servers | ✅ Available |
| **3001** | **Our bot** | ✅ **CHOSEN** |
| 3002 | Alt Node dev | ✅ Available |
| 5173 | Vite dev server | ✅ Available |
| 8080 | Common alt web | ✅ Available |

---

## How T Shop Uses Port 3001

### Architecture
```
┌─────────────────────────────────────────┐
│ React Frontend (Port 5173)              │
│ runs on http://localhost:5173          │
└──────────────────┬──────────────────────┘
                   │
                   │ Sends order data
                   ↓
┌─────────────────────────────────────────┐
│ Bot Server (Port 3001)                  │
│ runs on http://localhost:3001          │
│ - /health endpoint                      │
│ - /send-order endpoint                  │
└──────────────────┬──────────────────────┘
                   │
                   │ Sends message
                   ↓
┌─────────────────────────────────────────┐
│ Telegram API (Internet)                 │
│ Sends to your chat                      │
└─────────────────────────────────────────┘
```

### Example Requests
```bash
# Health check (verify bot is running)
GET http://localhost:3001/health

# Send order to your chat
POST http://localhost:3001/send-order
Body: { order details }
```

---

## Running Bot Locally

### Start Bot on Port 3001
```bash
cd "telgram bot"
node server.js
# Output: ✅ Bot listening on port 3001
```

### Access Bot API
```bash
# From frontend or terminal
curl http://localhost:3001/health

# Response:
# {
#   "ok": true,
#   "service": "T Shop Telegram Bot",
#   "timestamp": "2026-04-15T..."
# }
```

---

## Port Configuration

### Environment Variable
In `.env.local`:
```env
PORT=3001
```

### In Code
File: `telgram bot/server.js`
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Bot listening on port ${PORT}`);
});
```

---

## Changing the Port (Optional)

If you need a different port (e.g., 3000 or 8000):

### Step 1: Update Environment Variable
```env
PORT=3000  // Change from 3001 to 3000
```

### Step 2: Restart Bot Server
```bash
node server.js
# Now listening on port 3000
```

### Step 3: Update Frontend
Update bot API URL in frontend:
```javascript
// Old: http://localhost:3001
// New: http://localhost:3000
const BOT_API_URL = "http://localhost:3000";
```

---

## Port on Different Environments

### Local Development
```
Frontend: http://localhost:5173
Bot API: http://localhost:3001
```

### Deployed on ClawCloud
```
Frontend: https://tdigitalstore.web.app
Bot API: https://t-shop-bot-xxxx.run.claw.cloud
(Port hidden by ClawCloud, always HTTPS on 443)
```

### Deployed on Firebase Functions
```
Frontend: https://tdigitalstore.web.app
Bot API: https://novel-db4b6.cloudfunctions.net/botApi
(Firebase handles port mapping)
```

---

## Troubleshooting

### "Port 3001 already in use"
```bash
# Find process using port 3001
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Kill the process or use different port
PORT=3002 node server.js
```

### Bot not responding
```bash
# Check if bot is running
curl http://localhost:3001/health

# If error: Check port in .env.local
cat telgram bot/.env.local | grep PORT
```

### Frontend can't reach bot
- Frontend URL: `http://localhost:5173`
- Bot URL must be: `http://localhost:3001` (not localhost, not 5173)
- Check VITE_BOT_API_URL in `.env.local`

---

## Summary

- **Port 3001** = Door number for bot server
- **Why 3001?** = Safe, available, standard for Node.js
- **Can change?** = Yes, update PORT env var
- **On ClawCloud?** = Port hidden, uses HTTPS 443
- **In code?** = `const PORT = process.env.PORT || 3001`

Think of ports like radio frequencies - each app needs its own frequency to communicate! 📡
