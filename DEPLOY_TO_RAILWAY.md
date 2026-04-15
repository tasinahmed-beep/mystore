# Deploy Bot to Railway.app (Free Alternative)

Railway.app offers a free tier perfect for hosting the Telegram bot server without upgrading Firebase.

## Why Railway?

✅ **Free tier includes:**
- $5/month free credits
- Always-on hosting
- Enough for small shop bot
- Easy GitHub integration

⚠️ **Limitations:**
- Free tier might stop after 30 days without activity
- Logs preserved for 5 days only
- Good for production but not guaranteed SLA

## Prerequisites

1. GitHub account (free)
2. Railway account (free): https://railway.app

## Step 1: Push Code to GitHub

```bash
# Initialize git in your project
git init

# Create .gitignore (important!)
echo "node_modules/" > .gitignore
echo ".env.local" >> .gitignore
echo "dist/" >> .gitignore

# Commit everything EXCEPT sensitive files
git add .
git commit -m "Initial T-Shop release"

# Create new repo on https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/t-shop.git
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub access
5. Select your `t-shop` repository
6. Choose `telgram bot` folder as root directory

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to Project → Variables
2. Add:
   ```
   BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
   OWNER_CHAT_ID=7773751516
   GROUP_NAME=T Shop Support
   STORE_URL=https://tdigitalstore.web.app
   PORT=8080
   NODE_ENV=production
   ```

3. Click "Deploy"

## Step 4: Get Railway Bot URL

After deployment (2-5 minutes):

1. Go to Railway dashboard
2. View your project
3. Find the URL in the sidebar (e.g., `https://t-shop-bot-prod.up.railway.app`)
4. Copy it

## Step 5: Update Frontend

Update root `.env.local`:

```
VITE_BOT_API_URL=https://t-shop-bot-prod.up.railway.app/api
```

Then rebuild:

```bash
npm run build
npx firebase deploy --only hosting
```

## Step 6: Test

1. Visit https://tdigitalstore.web.app
2. Add products to cart
3. Checkout with your telegram username
4. Order should appear in Telegram chat

## Linking Both Repositories

**Option A: Monorepo (Recommended)**
```
t-shop/
├── src/              (frontend)
├── functions/        (or telgram bot/)
├── package.json
└── telgram bot/
    ├── server.js
    ├── package.json
    └── .env.local
```

Then in Railway:
- Create 2 services
- Service 1: Frontend (root directory), run `npm run build`
- Service 2: Bot (`telgram bot/` directory), run `npm start`

**Option B: Separate Repos**
- `t-shop-frontend` → Firebase Hosting
- `t-shop-bot` → Railway.app

## Automatic Deploys

Once connected to Railway:

1. Make changes locally
2. Commit: `git add . && git commit -m "Update bot"`
3. Push: `git push`
4. Railway automatically redeploys!

## Monitoring

View logs in Railway:

```
Railway Dashboard → Your Project → Logs
```

Shows all bot output in real-time.

## Cost Breakdown

| Usage | Cost |
|-------|------|
| 100 orders/month | FREE (within $5 credit) |
| 1,000 orders/month | FREE (within $5 credit) |
| 10,000 orders/month | ~$1-3/month |

## Troubleshooting

**Bot not receiving orders?**
1. Check Railway logs for errors
2. Verify .env.local in Railway dashboard
3. Make sure bot token is correct

**Railway keeping service running?**
- Go to Project Settings → Runtime
- Make sure auto-restart is enabled
- View health status

**Need to update bot code?**
```bash
# Make changes locally
git add .
git commit -m "Fix bot..."
git push
# Railway auto-deploys in 1-2 minutes
```

## Keeping Free Tier Active

Railway requires activity to keep free credits:

- Make small commits monthly
- Or: Deploy with GitHub Actions to auto-deploy

To ensure uptime, add to `.github/workflows/deploy.yml`:

```yaml
name: Keep Railway Awake
on:
  schedule:
    - cron: '0 0 1 * *'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: echo "Auto-deploy" > README.md
      - uses: actions/upload-artifact@v2
```

## Quick Decision Matrix

| Need | Solution |
|------|----------|
| Simplest solution | Firebase Blaze |
| Free forever | Railway.app |
| Local testing | Run locally `npm start` |
| Multiple regions | Railway scale |
| Maximum uptime | Firebase |

## Files to Deploy to Railway

Railway needs these in `telgram bot/` folder:
- ✅ `server.js`
- ✅ `package.json` 
- ✅ `.env.local` (via Railway dashboard, not committed)
- ✅ `README.md` (optional)

## Next Steps

1. Create GitHub account (free)
2. Push code: `git push`
3. Create Railway account
4. Connect GitHub repo
5. Set environment variables
6. Update frontend `.env.local`
7. Redeploy frontend to Firebase

Done! Your bot runs on Railway, frontend on Firebase, all on same domain with rewrites.
