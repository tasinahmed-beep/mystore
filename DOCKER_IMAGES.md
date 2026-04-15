# Docker Image Versions - T Shop Bot

## Your Docker Images

### Latest Version (Recommended)
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```
- Always the newest build
- Auto-updates when you push code
- Use this for production

### Specific Commit Version
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:sha-0083016
```
- Fixed to this exact commit
- Won't change when you push new code
- Use this for testing specific versions

---

## How to Pull Locally

### Pull Latest
```bash
docker pull ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

### Pull Specific Version
```bash
docker pull ghcr.io/tasinahmed-beep/mystore/t-shop-bot:sha-0083016
```

---

## How to Run

### Run Latest
```bash
docker run -e BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4 \
  -e OWNER_CHAT_ID=7773751516 \
  -p 3001:3001 \
  ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

### Run Specific Version
```bash
docker run -e BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4 \
  -e OWNER_CHAT_ID=7773751516 \
  -p 3001:3001 \
  ghcr.io/tasinahmed-beep/mystore/t-shop-bot:sha-0083016
```

---

## For ClawCloud Deployment

Choose one URL and paste into ClawCloud Docker Image field:

**Option 1 (Latest - Recommended):**
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

**Option 2 (Fixed Version):**
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:sha-0083016
```

Then add environment variables:
```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
PORT=3001
STORE_URL=https://tdigitalstore.web.app
GROUP_NAME=T Shop Support
```

Click Deploy! 🚀
