# ClawCloud Environment Variables Setup

## Quick Reference

Add these 5 environment variables in ClawCloud's "Environment Variables" section:

### Step-by-Step in ClawCloud Dashboard

1. **BOT_TOKEN**
   - Name: `BOT_TOKEN`
   - Value: `8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4`

2. **OWNER_CHAT_ID**
   - Name: `OWNER_CHAT_ID`
   - Value: `7773751516`

3. **PORT**
   - Name: `PORT`
   - Value: `3001`

4. **STORE_URL**
   - Name: `STORE_URL`
   - Value: `https://tdigitalstore.web.app`

5. **GROUP_NAME**
   - Name: `GROUP_NAME`
   - Value: `T Shop Support`

## How to Add in ClawCloud UI

1. Scroll to **"Environment Variables"** section
2. Click **"+ Add"** button
3. Fill in Name and Value for each variable
4. Click **"+ Add"** again for the next variable
5. Repeat for all 5 variables
6. Scroll down and click **"Deploy"** button

## After Deployment

Once deployed successfully, ClawCloud will give you a service URL:
```
https://t-shop-bot-XXXX.run.claw.cloud/
```

### Test the Bot

```bash
curl https://t-shop-bot-XXXX.run.claw.cloud/health
```

Should return:
```json
{
  "ok": true,
  "service": "T Shop Telegram Bot",
  "timestamp": "2026-04-15T12:00:00.000Z"
}
```

### Update Frontend

Update your React app's environment to use the ClawCloud URL:

**File:** `.env.local` (in root of project)
```
VITE_BOT_API_URL=https://t-shop-bot-XXXX.run.claw.cloud
```

Then redeploy the frontend to Firebase:
```bash
npm run build
firebase deploy --only hosting
```

## Environment Variables Explained

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `BOT_TOKEN` | Telegram bot API token from @BotFather | ✅ Yes | None |
| `OWNER_CHAT_ID` | Your Telegram chat ID (receives orders) | ✅ Yes | None |
| `PORT` | HTTP server port | No | 3001 |
| `STORE_URL` | Link to your store (in bot messages) | No | https://tdigitalstore.web.app |
| `GROUP_NAME` | Support group name (in auto-reply) | No | T Shop Support |

## Verify Bot is Running

Check ClawCloud dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Should see: `"✅ Bot is now polling for updates"`
4. No error messages

If you see errors, check:
- BOT_TOKEN is correct
- OWNER_CHAT_ID is correct
- No typos in variable names

## Next Steps

1. ✅ Add all 5 environment variables in ClawCloud
2. ✅ Click "Deploy"
3. ✅ Wait for deployment to complete (2-3 minutes)
4. ✅ Test with curl command above
5. ✅ Update frontend VITE_BOT_API_URL
6. ✅ Test bot by sending order from your store
