# Docker Workflow Setup & ClawCloud Deployment Guide

## Overview

This guide walks through:
1. Creating GitHub Actions Docker workflow
2. Building and publishing Docker image to GitHub Container Registry (GHCR)
3. Making image public
4. Deploying to ClawCloud with local storage

---

## Step 1: Create GitHub Actions Workflow File

### Location
```
.github/workflows/docker-publish.yml
```

### Steps in GitHub Web UI

1. Open your repository in browser
2. Click **"Add file"** → **"Create new file"**
3. Enter path: `.github/workflows/docker-publish.yml`
4. Paste this exact content:

```yaml
name: Build And Publish Docker Image

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  REGISTRY: ghcr.io

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract image metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}
          tags: |
            type=raw,value=latest
            type=sha

      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

5. Click **"Commit directly to main"**

---

## Step 2: Trigger the Workflow

### Run Automatically
- Push code to main branch (or the workflow runs automatically)

### Or Run Manually
1. Go to **Actions** tab in your repo
2. Click **"Build And Publish Docker Image"**
3. If it hasn't run, click **"Run workflow"** button
4. Wait for ✅ completion (usually 3-5 minutes)

---

## Step 3: Make Container Image Public

### Steps

1. Click your **profile icon** (top right of GitHub)
2. Go to **Packages**
3. Find your container package (e.g., `mystore` or `telegram_file`)
4. Click on it
5. Go to **Package settings** (bottom left)
6. Scroll to **Danger Zone**
7. Click **Change visibility**
8. Select **Public**
9. Confirm

### Get Exact Image Name

In the package page, copy the image name from:
```
Docker pull command shows:
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
```

---

## Step 4: Deploy to ClawCloud

### Image Name Format
```
ghcr.io/tasinahmed-beep/mystore:latest
```

Replace:
- `tasinahmed-beep` = your GitHub username
- `mystore` = your repository name
- `:latest` = tag (always include this)

### ClawCloud Setup

#### Basic Configuration
- **Application Name:** `my-bot` (or similar)
- **Image Name:** `ghcr.io/tasinahmed-beep/mystore:latest`
- **Public Access:** OFF (private)
- **Replicas:** 1

#### Environment Variables (Add one per line)
```
TELEGRAM_BOT_TOKEN=your_new_rotated_token_here
BOT_DB_PATH=/app/data/file_archive.db
LOG_LEVEL=INFO
```

⚠️ **IMPORTANT:** Use a NEW token rotated in BotFather, not the old exposed one!

#### Local Storage (Add)
1. Click **"Add"** next to Local Storage
2. Fill in:
   - **Mount Path:** `/app/data`
   - **Size:** 1 GB (or small)
   - **Name:** `bot-data` (if asked)

#### Resource Configuration
- **CPU:** 0.2 or 0.5
- **Memory:** 256M or 512M
- **Container Port:** Leave empty (unless required)

#### Leave Empty
- ❌ Command
- ❌ Arguments  
- ❌ Configmaps

### Deploy
Click **"Deploy Application"**

---

## Troubleshooting

### Image Not Found
- [ ] Image name has `:latest` tag
- [ ] Image name is all lowercase
- [ ] Container is set to **Public** in GitHub
- [ ] Correct repository name in URL

### Container won't start
- [ ] Local storage path is `/app/data` (must match app)
- [ ] All env variables have correct values
- [ ] Not enough memory allocated (try 512M)

### Token issues
- [ ] Using NEW rotated token (not exposed one)
- [ ] Token is exactly correct (no extra spaces)
- [ ] Token is for correct bot

---

## Security Checklist

Before deploying:

- [ ] Rotated old Telegram token in BotFather
- [ ] Using NEW token in ClawCloud env vars
- [ ] Container set to Private or Public (according to needs)
- [ ] Local storage mounted for data persistence
- [ ] No exposed secrets in GitHub Actions

---

## After Deployment

### Test Bot
```bash
curl https://your-service-url.run.claw.cloud/health
```

### Update Frontend
If bot URL changed:
```
VITE_BOT_API_URL=https://your-service-url.run.claw.cloud
```

### Monitor Logs
In ClawCloud dashboard:
- Click service
- Click **"Logs"** tab
- Watch real-time logs

---

## Reference

| Item | Value |
|------|-------|
| Workflow file | `.github/workflows/docker-publish.yml` |
| Image registry | GitHub Container Registry (GHCR) |
| Image format | `ghcr.io/username/repo:latest` |
| Deployment target | ClawCloud |
| Bot DB path | `/app/data` |
| Min CPU | 0.2 |
| Min Memory | 256M |

---

## Next Steps

1. ✅ Create workflow file in GitHub
2. ✅ Run workflow (wait for build)
3. ✅ Make image public in GitHub
4. ✅ Get exact image name
5. ✅ Rotate token in BotFather
6. ✅ Deploy to ClawCloud with env vars
7. ✅ Add local storage mount
8. ✅ Click Deploy
9. ✅ Wait 2-3 minutes
10. ✅ Test and monitor logs

Send screenshots at each step if you need help! 📸
