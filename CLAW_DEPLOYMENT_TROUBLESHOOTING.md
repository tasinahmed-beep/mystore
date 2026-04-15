# ClawCloud Deployment Troubleshooting

## Issue: "Deployment Failed" Error

### Problem
When deploying to ClawCloud, you see:
```
⚠️ Deployment Failed
发证错误 (Certificate Error / Verification Error)
```

This usually means the Docker image URL is incorrect or the image doesn't exist yet.

---

## Solution A: Use Correct Image URL (Recommended)

### Exact Image URL to Use
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

### Critical Details
- ✅ All **lowercase** letters
- ✅ Ends with **`:latest`** tag
- ✅ No spaces before or after
- ✅ Full path with `/t-shop-bot`

### Common Mistakes
| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| `ghcr.io/tasinahmed-beep/mystore/t-shop-botsha-c` | `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest` |
| `GHCR.IO/...` (uppercase) | `ghcr.io/...` (lowercase) |
| `ghcr.io/.../t-shop-bot` (no tag) | `ghcr.io/.../t-shop-bot:latest` |
| Extra spaces | No spaces |

---

## Solution B: Deploy from Git Repository (Alternative)

If the Docker image URL doesn't work, use GitHub repository directly:

### Steps

1. **Go back** to service creation
2. Click **"New Service"** → **"GitHub Repository"** (not Docker Image)
3. **Connect GitHub**:
   - Repository: `tasinahmed-beep/mystore`
   - Branch: `main`

4. **Configure Build**:
   - Root directory: `telgram bot`
   - Dockerfile: `Dockerfile`

5. **Add Environment Variables** (same 5):
   ```
   BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
   OWNER_CHAT_ID=7773751516
   PORT=3001
   STORE_URL=https://tdigitalstore.web.app
   GROUP_NAME=T Shop Support
   ```

6. **Deploy** - ClawCloud will automatically build the Docker image

---

## Verify Docker Image Exists

### Check GitHub Actions Status
1. Go to: https://github.com/tasinahmed-beep/mystore/actions
2. Look for workflow: **"Build and Push Docker Image"**
3. Should show ✅ **Success** status

If shows ❌ **Failed**:
- Check error logs
- May need to rebuild by pushing new commit

### Check Image in GitHub Container Registry
1. Go to: https://github.com/tasinahmed-beep/mystore/pkgs/container/mystore/t-shop-bot
2. Should show image tagged as `:latest`
3. If empty, GitHub Actions hasn't built it yet

---

## Step-by-Step Fix

### Fix Option 1: Docker Image URL
1. ❌ Delete current deployment attempt
2. Clear the image name field completely
3. ✅ Paste exact URL: `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest`
4. Re-add environment variables (copy from CLAW_ENV_CLEAN.txt)
5. Click **"Deploy"**
6. Wait 2-3 minutes for deployment

### Fix Option 2: GitHub Repository
1. ❌ Delete current attempt
2. Select **"GitHub Repository"** option
3. Connect `tasinahmed-beep/mystore`
4. Set root directory to `telgram bot`
5. Add environment variables
6. Click **"Deploy"**
7. Wait 3-5 minutes (includes build time)

---

## After Successful Deployment

Once deployed, you get a URL like:
```
https://t-shop-bot-xxxx.run.claw.cloud
```

### Test Bot API
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

### Update Frontend
File: `.env.local` (in root)
```
VITE_BOT_API_URL=https://t-shop-bot-xxxx.run.claw.cloud
```

Redeploy frontend:
```bash
npm run build
firebase deploy --only hosting
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Deployment Failed" | Wrong image URL | Use exact URL from Solution A |
| "Image not found" | Image doesn't exist | Try Solution B (Git repo) |
| "Certificate error" | Image URL malformed | Check spelling and lowercase |
| Bot not responding | Wrong bot URL in frontend | Update VITE_BOT_API_URL |
| Orders not arriving | Missing BOT_TOKEN/OWNER_CHAT_ID | Verify env vars exact values |

---

## Environment Variables Reference

Always use these exact values:

```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
PORT=3001
STORE_URL=https://tdigitalstore.web.app
GROUP_NAME=T Shop Support
```

All 5 are required for bot to work correctly.

---

## Need More Help?

1. **Check GitHub Actions**: https://github.com/tasinahmed-beep/mystore/actions
2. **View Docker Image**: https://github.com/tasinahmed-beep/mystore/pkgs/container/mystore/t-shop-bot
3. **Check ClawCloud Logs**: In dashboard, click service → "Logs" tab
4. **Test Bot Endpoint**: Use curl or Postman to test `/health` endpoint
