# Deploy T Shop Bot to ClawCloud

## Step 1: Get GitHub Docker Image

Your Docker image is automatically built by GitHub Actions:
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

## Step 2: Deploy to ClawCloud

### Option A: Using Docker (Recommended)

1. Go to: https://ap-southeast-1.run.claw.cloud/
2. Click **"New Service"** → **"Docker Image"**
3. Enter image URL: `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest`
4. Set environment variables:
   ```
   BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
   OWNER_CHAT_ID=7773751516
   PORT=3001
   STORE_URL=https://tdigitalstore.web.app
   GROUP_NAME=T Shop Support
   ```
5. Click **"Deploy"**

### Option B: Using Git Repository

1. Go to: https://ap-southeast-1.run.claw.cloud/
2. Click **"New Service"** → **"GitHub Repository"**
3. Connect your repository: `https://github.com/tasinahmed-beep/mystore`
4. Set root directory: `/telgram bot`
5. Set `Dockerfile` path: `Dockerfile`
6. Add environment variables (same as Option A)
7. Click **"Deploy"**

## Step 3: Verify Deployment

After deployment, ClawCloud will give you a URL like:
```
https://t-shop-bot-xxxx.run.claw.cloud/
```

Test the bot API:
```bash
curl https://t-shop-bot-xxxx.run.claw.cloud/health
```

Should return:
```json
{
  "ok": true,
  "service": "T Shop Telegram Bot",
  "timestamp": "2026-04-15T..."
}
```

## Step 4: Update Frontend

Update your frontend to use the new bot URL:

**File:** `src/.env.local` or `vite.config.ts`
```
VITE_BOT_API_URL=https://t-shop-bot-xxxx.run.claw.cloud
```

## Step 5: Redeployment (Automatic)

Every time you push to GitHub main branch:
1. GitHub Actions builds new Docker image
2. Updates: `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest`
3. (Optional) Deploy to Railway if `RAILWAY_TOKEN` is set
4. You can manually redeploy to ClawCloud or set up webhook

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `BOT_TOKEN` | `8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4` | ✅ Yes |
| `OWNER_CHAT_ID` | `7773751516` | ✅ Yes |
| `PORT` | `3001` | No (default) |
| `STORE_URL` | `https://tdigitalstore.web.app` | No |
| `GROUP_NAME` | `T Shop Support` | No |

## Troubleshooting

### Image pull fails
- Ensure GitHub Container Registry is public
- Check token permissions at: https://github.com/settings/tokens

### Bot doesn't receive messages
- Verify `BOT_TOKEN` and `OWNER_CHAT_ID` in ClawCloud settings
- Test token: `curl https://api.telegram.org/bot<TOKEN>/getMe`

### Logs
In ClawCloud dashboard, click service → **"Logs"** to view real-time logs

## Links

- **Repository:** https://github.com/tasinahmed-beep/mystore
- **Docker Image:** ghcr.io/tasinahmed-beep/mystore/t-shop-bot
- **Frontend:** https://tdigitalstore.web.app
- **ClawCloud:** https://ap-southeast-1.run.claw.cloud/
