# 🛍️ T Shop - Digital Products Store

Professional e-commerce platform for selling digital products with instant Telegram notifications and Docker deployment.

**Live Sites:**
- 🎯 Main: https://tdigitalstore.web.app
- 📦 Backup: https://novel-db4b6.web.app

---

## ✨ Features

### 🛒 Shopping & Checkout
- React 19 + Vite (blazing fast)
- 30+ digital products (GitHub Student/Teacher verification, CapCut Pro, etc.)
- Shopping cart with localStorage persistence
- Binance (USDT) payment integration
- Real-time price calculations
- Product warranty information display

### 📱 Telegram Integration
- Real-time order notifications to Telegram
- Rich HTML formatted messages with emojis & stickers
- Auto-reply to customer messages (20-min cooldown)
- Clickable product links in messages
- Support contact information

### 🐳 Docker & Deployment
- Production-ready Dockerfile (multi-stage, Alpine Linux)
- docker-compose.yml for easy orchestration
- Firebase Hosting deployment
- GitHub Actions CI/CD pipeline
- Cloud Functions support

### 🔐 Security
- Environment variables for secrets
- .gitignore for sensitive data
- Non-root Docker user
- Health checks and auto-restart
- GitHub Secrets for CI/CD

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker (optional)
- Firebase CLI (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Start bot (in separate terminal)
cd telgram\ bot
npm install
npm start

# Start frontend dev server
npm run dev

# Visit http://localhost:5173
```

### Docker Deployment

```bash
cd telgram\ bot
node docker-helper.mjs setup    # Interactive setup
node docker-helper.mjs up       # Start bot container
```

### Firebase Deployment

```bash
# Build frontend
npm run build

# Deploy
firebase deploy
```

---

## 📁 Project Structure

```
mystore/
├── src/                        # React application
│   ├── App.tsx                # Main component with cart/checkout
│   ├── data/products.json     # 30 products
│   ├── main.tsx               # Entry point
│   └── styles.css             # Tailwind + custom styles
├── telgram bot/               # Telegram bot server
│   ├── server.js              # Express app + bot logic
│   ├── Dockerfile             # Multi-stage build
│   ├── docker-compose.yml     # Container config
│   └── docker-helper.mjs      # CLI helper
├── functions/                 # Firebase Cloud Functions
│   ├── index.js               # Cloud Function wrapper
│   └── package.json           # Dependencies
├── public/assets/products/    # Product images (URLs)
├── .github/workflows/         # CI/CD automation
├── firebase.json              # Firebase config (2 sites)
└── package.json              # Dependencies & scripts
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19.2.0
- TypeScript
- Vite 8.0.8
- Tailwind CSS

**Backend:**
- Node.js 20
- Express 4.21.2
- node-telegram-bot-api 0.66.0
- CORS enabled

**Deployment:**
- Firebase Hosting (Frontend)
- Firebase Cloud Functions (Bot API)
- Docker Compose (Local/VPS)
- GitHub Actions (CI/CD)

**Database:**
- Browser LocalStorage (orders)
- No backend DB needed

---

## 📦 Products

30 digital products including:
- ✅ GitHub Student Verification ($4, 10-day warranty)
- ✅ GitHub Teacher Verification ($7, 10-day warranty)
- ✅ CapCut Pro (35-day auto-renew)
- ✅ Veo3 Ultra (25k credits)
- ✅ Adobe Full App
- ✅ Canva Pro
- ✅ ChatGPT Business
- And 22 more...

All products use image URLs (no local files committed).

---

## 🤖 Telegram Bot

**Bot:** @TStoreDigitalbot
**Features:**
- Order notifications with rich formatting
- Sticker animations on order receipt
- Auto-reply to customer messages
- Product links in notifications
- Support contact information

**Configuration:**
- Token: Configured via environment variables
- Chat ID: 7773751516 (or configure your own)
- Port: 3001 (configurable)

---

## 🚢 Deployment Options

### 1. Firebase Hosting + Cloud Functions
```bash
firebase deploy
```

### 2. Docker + Railway.app
```bash
cd telgram\ bot
node docker-helper.mjs setup && docker-compose up -d
```

### 3. GitHub Actions Auto-Deploy
Push to `main` branch → auto-deploys via GitHub Actions

### 4. Local Development
```bash
npm run dev              # Frontend at localhost:5173
cd telgram\ bot && npm start  # Bot at localhost:3001
```

---

## 📋 Configuration

### Environment Variables

**Frontend (.env.local):**
```
VITE_BOT_API_URL=http://localhost:3001/api
```

**Bot (telgram bot/.env.local):**
```
BOT_TOKEN=your_bot_token
OWNER_CHAT_ID=your_chat_id
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
PORT=3001
```

---

## 🔗 Available Scripts

```bash
# Frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run type-check    # TypeScript check

# Bot
cd telgram\ bot
npm start            # Start bot server

# Docker
cd telgram\ bot
node docker-helper.mjs setup   # Setup
node docker-helper.mjs up      # Start
node docker-helper.mjs logs    # View logs
node docker-helper.mjs down    # Stop
```

---

## 📚 Documentation

- **Telegram Integration:** [CART_TELEGRAM_COMPLETE_DOCS.md](CART_TELEGRAM_COMPLETE_DOCS.md)
- **Bot Deployment:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Docker Setup:** [telgram\ bot/DOCKER_QUICK_START.md](telgram\ bot/DOCKER_QUICK_START.md)
- **GitHub Push:** [GITHUB_PUSH_GUIDE.md](GITHUB_PUSH_GUIDE.md)
- **Firebase:** [FIREBASE_BLAZE_REQUIRED.md](FIREBASE_BLAZE_REQUIRED.md)
- **Railway.app:** [DEPLOY_TO_RAILWAY.md](DEPLOY_TO_RAILWAY.md)

---

## 🔐 Security

✅ **Implemented:**
- Environment variables for secrets
- .gitignore excludes .env files
- Docker non-root user
- GitHub Secrets for CI/CD
- CORS enabled
- Health checks

❌ **Never:**
- Commit .env files
- Share GitHub tokens
- Store secrets in code
- Expose bot tokens

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Support

For issues and questions:
1. Check documentation files
2. Review GitHub Issues
3. Check GitHub Discussions

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🎯 Roadmap

- [ ] User accounts & order history
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email order notifications
- [ ] Admin dashboard
- [ ] Product analytics
- [ ] Review system
- [ ] Wishlist feature

---

## 🏆 Status

✅ **Production Ready**
- Frontend: Deployed to Firebase
- Bot: Ready for deployment
- Documentation: Complete
- CI/CD: GitHub Actions configured

---

**Made with ❤️ for T Shop**

Last updated: April 2026
