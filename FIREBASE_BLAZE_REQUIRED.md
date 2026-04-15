# Firebase Cloud Functions Deployment - Blaze Plan Required

## Issue

Deployment to Firebase Cloud Functions requires a **Blaze (pay-as-you-go) plan**. Your project `novel-db4b6` is currently on the **Spark (free) plan**.

## What This Means

Firebase Cloud Functions need the Blaze plan because they use:
- Google Cloud Build (compiling your code)
- Artifact Registry (storing built functions)
- Cloud Functions runtime management

These services require a paid plan even though usage may be within free tier quotas.

## Your Options

### Option 1: Upgrade to Blaze Plan (RECOMMENDED)
✅ **Benefits:**
- Simplest solution
- Same Firebase project for frontend + bot
- Automatic scaling
- Free tier quotas: 2M function invocations/month

⚠️ **Cost:**
- Only pay for what you use
- Very cheap for a small shop
- Many small projects run free

**Steps:**
1. Visit: https://console.firebase.google.com/project/novel-db4b6/usage/details
2. Click "Upgrade to Blaze"
3. Add billing info (just in case)
4. Then run: `firebase deploy --only functions`

### Option 2: Use Separate Bot Server (CURRENT SETUP)
Instead of Cloud Functions, host bot separately:
- Local machine with `npm start` in `telgram bot/` folder
- Railway.app (free tier available)
- Render.com (free tier)
- Replit (free tier)
- Heroku (requires paid plan now)

**Setup:**
1. Run bot locally: `cd telgram\ bot && npm start`
2. Update frontend `.env.local`:
   ```
   VITE_BOT_API_URL=http://localhost:5000/api
   ```
3. Or deploy to Railway/Render and use their URL

### Option 3: Keep Bot Local, Deploy Frontend Only
**Current approach:**
- Frontend on Firebase (already deployed ✅)
- Bot running on your machine locally
- Works for development/testing

**Limitation:**
- Live site can't reach local machine
- Only works on same network

## Recommendation

**For production deployment:** Upgrade to Blaze plan
- Cost is minimal ($0-$5/month for most small shops)
- Simplest architecture
- Best user experience

**For development/testing:** Run bot locally
- Free unlimited
- Same firewall considerations

## Firebase Blaze Pricing

**Typical small shop usage:**
- 2M invocations/month: FREE (included in Blaze)
- CPU, memory, network: FREE (within tier)
- Storage: FREE (small orders)

**Breakdown per function call:**
- ~0.0000001 per call
- 100 orders/day = less than $0.01/month

## Files Ready to Deploy

Once you upgrade to Blaze:

```bash
cd "d:\IUT\My shop"
firebase deploy --only functions
```

All configuration is ready:
- ✅ `functions/package.json` - Dependencies
- ✅ `functions/index.js` - Bot code
- ✅ `functions/.env.local` - Credentials
- ✅ `firebase.json` - Hosting + Functions config
- ✅ `.env.local` - Frontend API URL

## Quick Upgrade Process

1. **Go to:** https://console.firebase.google.com/project/novel-db4b6/usage/details
2. Click **"Upgrade to Blaze"** button
3. Follow payment setup (1-2 minutes)
4. Return to terminal and run:
   ```bash
   firebase deploy --only functions
   ```

## Troubleshooting

**If you don't want to upgrade:**
- Bot server can run on Railway.app, Render, or Replit (all free)
- Would need to push code to GitHub and connect to these services
- Or: Keep running bot locally for testing

**Questions:**
- Cloud Functions doc: https://firebase.google.com/docs/functions
- Blaze plan details: https://firebase.google.com/pricing
- Alternative: Deploy to Railway.app instead
