# ClawCloud Bot Deployment - Quick Start

## ⚠️ CRITICAL: Image URL Format

Your Docker image URL **MUST** be:

```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

### Common Mistakes

| ❌ WRONG | ✅ CORRECT | Issue |
|---------|-----------|-------|
| `ghcr.io/tasinahmed-beep/mystore/t-shop-botlatest` | `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest` | Missing colon `:` |
| `ghcr.io/.../t-shop-bot` | `ghcr.io/.../t-shop-bot:latest` | Missing `:latest` tag |
| `GHCR.IO/...` | `ghcr.io/...` | Uppercase letters |
| `ghcr.io/tasinahmed-beep/mystore /t-shop-bot:latest` | `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest` | Space in path |

**THE COLON IS REQUIRED: `:`**

---

## Step-by-Step Deployment

### Step 1: Delete Previous Failed Attempt
- Go back to ClawCloud dashboard
- Delete the failed service
- Start fresh

### Step 2: Create New Service
1. Click **"New Service"**
2. Select **"Docker Image"**

### Step 3: Enter Image URL
Copy and paste **EXACTLY**:
```
ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
```

✅ Has colon
✅ All lowercase
✅ No typos
✅ No spaces

### Step 4: Add Environment Variables
Add these 5 variables **exactly**:

```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
PORT=3001
STORE_URL=https://tdigitalstore.web.app
GROUP_NAME=T Shop Support
```

Or use copy-paste from file: `CLAW_ENV_CLEAN.txt`

### Step 5: Configure Resources (Optional)
Default is fine:
- CPU: 0.2
- Memory: 256 MB
- Fixed instance

### Step 6: Deploy
Click **"Deploy Application"** button

### Step 7: Wait
⏳ Deployment takes 2-3 minutes

---

## Success Indicators

After deployment succeeds, you'll see:
- ✅ Service status: **Running**
- ✅ URL: `https://t-shop-bot-xxxx.run.claw.cloud`
- ✅ No error messages

### Test the Bot

Run in terminal:
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

---

## If Deployment Fails

### Error: "Deployment Failed" / "Certificate Error"

**Likely Cause:** Image URL is wrong

**Check:**
- [ ] URL has colon `:` before `latest`
- [ ] All lowercase letters
- [ ] No extra spaces
- [ ] Exactly: `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest`

**Fix:**
1. Delete this deployment
2. Create new one with correct URL
3. Try again

### Error: "Image not found"

**Likely Cause:** Image doesn't exist or GitHub build failed

**Check:**
1. Go to: https://github.com/tasinahmed-beep/mystore/pkgs/container/mystore/t-shop-bot
2. Should see `:latest` tag
3. If empty, GitHub Actions hasn't built it yet
4. Wait 5 minutes and refresh

### Error: "Bot not responding"

**Likely Cause:** Missing environment variables

**Check:**
- [ ] BOT_TOKEN is exact (all characters)
- [ ] OWNER_CHAT_ID is `7773751516`
- [ ] All 5 variables present
- [ ] No typos

**Fix:**
1. Stop deployment
2. Edit service settings
3. Verify all env vars
4. Restart

---

## After Successful Deployment

### 1. Update Frontend Bot URL
File: `d:\IUT\My shop\.env.local`

```
VITE_BOT_API_URL=https://t-shop-bot-xxxx.run.claw.cloud
```

Replace `xxxx` with actual ClawCloud service ID

### 2. Redeploy Frontend
```bash
npm run build
firebase deploy --only hosting
```

### 3. Test Full Flow
1. Go to https://tdigitalstore.web.app
2. Add product to cart
3. Click "Send to Telegram"
4. Check if order arrives in Telegram ✅

---

## Docker Image URL Breakdown

```
ghcr.io / tasinahmed-beep / mystore / t-shop-bot : latest
│        │                │        │             │
│        User            Repo     Image name    Tag
│
GitHub Container Registry
```

Every part matters!

---

## Quick Reference

| What | Value |
|-----|-------|
| Image URL | `ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest` |
| BOT_TOKEN | `8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4` |
| OWNER_CHAT_ID | `7773751516` |
| PORT | `3001` |
| STORE_URL | `https://tdigitalstore.web.app` |
| GROUP_NAME | `T Shop Support` |
| ClawCloud URL | https://ap-southeast-1.run.claw.cloud/ |
| GitHub Packages | https://github.com/tasinahmed-beep/mystore/pkgs/container/mystore/t-shop-bot |

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Image URL has `:latest` tag
- [ ] Image URL is all lowercase
- [ ] All 5 environment variables present
- [ ] No typos in any value
- [ ] Deleted previous failed deployment
- [ ] Waited 2-3 minutes for deployment
- [ ] Checked GitHub image exists (not empty)
- [ ] Logs show no errors (check in ClawCloud dashboard)

---

## Need Help?

1. Check **CLAW_DEPLOYMENT_TROUBLESHOOTING.md** for detailed help
2. Check **PORTS_EXPLAINED.md** to understand port 3001
3. Check **DOCKER_IMAGES.md** for image versions
4. Check GitHub Actions: https://github.com/tasinahmed-beep/mystore/actions
