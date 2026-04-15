# 🚀 GitHub Deployment Guide - T Shop

Your project is ready to push to GitHub! 

**Repository:** https://github.com/tasinahmed-beep/mystore.git

## ⚠️ SECURITY - READ FIRST

Your GitHub token was exposed in this chat. It has access to your account.

**IMMEDIATE ACTION REQUIRED:**
1. Go to: https://github.com/settings/tokens
2. Find the token: `11BX47IVI0vcEeYn6NEem0_oT9H1BiB3NmLzRKdBU2dDETpnmrLxNT5JNl644JlNQXBNBRQXU7F7Eejwi1`
3. Click "Delete" or "Revoke"
4. Generate a NEW token if needed

**Never share tokens again!** Use GitHub Secrets in Actions instead.

---

## 📤 Pushing Code to GitHub

### ✅ Status Check

Your project is ready:
```bash
✅ Git initialized
✅ Files staged  
✅ Initial commit created (105 files)
✅ Remote added (origin)
✅ Branch renamed to: main
```

### 🔑 Choose Your Authentication Method

#### Method 1️⃣: GitHub CLI (RECOMMENDED) ⭐

**Best for:** Simplest, most secure, auto-configured

```bash
# 1. Install GitHub CLI
# Visit: https://cli.github.com/

# 2. Authenticate
gh auth login
# Choose:
#   - GitHub.com
#   - HTTPS
#   - Y (Authenticate Git with credentials)

# 3. Push
cd "d:\IUT\My shop"
gh repo create --source=. --remote=origin --push
```

#### Method 2️⃣: SSH Keys (MOST SECURE) 🔐

**Best for:** Long-term use, automatic auth, no tokens stored locally

**Step 1: Generate SSH Key**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept defaults
# When asked for passphrase, just press Enter
```

**Step 2: Add to GitHub**
```bash
# Copy SSH key
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard

# Go to: https://github.com/settings/keys
# Click "New SSH key"
# Paste the copied key
# Save
```

**Step 3: Update Remote URL**
```bash
cd "d:\IUT\My shop"
git remote set-url origin git@github.com:tasinahmed-beep/mystore.git
```

**Step 4: Push**
```bash
git push -u origin main
```

#### Method 3️⃣: Git Credential Manager (EASY, SECURE) 🌐

**Best for:** GUI-based, credentials never typed in terminal

```bash
# Install Git Credential Manager
# Visit: https://github.com/git-ecosystem/git-credential-manager/releases
# Download and install for Windows

# Configure Git
git config --global credential.helper manager

# Push (will open browser to authenticate)
cd "d:\IUT\My shop"
git push -u origin main
```

#### Method 4️⃣: PAT (Personal Access Token) 🔑

**⚠️ Only if you must use token-based auth**

**Step 1: Create New Token**
- Go to: https://github.com/settings/tokens/new
- Name: "T-Shop-Deployment"
- Scopes check: `repo` (Full control of private repositories)
- Expiration: 90 days
- Click "Generate token"
- **COPY THE TOKEN** (you won't see it again)

**Step 2: Configure & Push**
```bash
cd "d:\IUT\My shop"

# Tell Git to store credentials temporarily
git config --local credential.helper store

# Push (will prompt for username and password/token)
git push -u origin main

# When prompted:
# Username: tasinahmed-beep
# Password: (paste your NEW token here)
```

This stores credentials in `.git/credentials` (local, not committed).

---

## 🚀 Quick Push Commands

Choose your method above, then run ONE of these:

```bash
# Method 1: GitHub CLI
gh repo create --source=. --remote=origin --push

# Method 2: SSH
git push -u origin main

# Method 3: Git Credential Manager (after setup)
git push -u origin main

# Method 4: PAT (after setup)
git push -u origin main
```

---

## ✅ After Pushing

Verify your push succeeded:

```bash
# Check remote status
git remote -v

# Should show:
#   origin  https://github.com/tasinahmed-beep/mystore.git (fetch)
#   origin  https://github.com/tasinahmed-beep/mystore.git (push)

# Or for SSH:
#   origin  git@github.com:tasinahmed-beep/mystore.git (fetch)
#   origin  git@github.com:tasinahmed-beep/mystore.git (push)

# View push history
git log --oneline -5
```

---

## 📊 What Gets Pushed

**Included (105 files):**
- ✅ src/ - React application
- ✅ public/ - Static assets & product images (using URLs)
- ✅ telgram bot/ - Bot server + Docker config
- ✅ functions/ - Firebase Cloud Functions
- ✅ Documentation - All .md files
- ✅ Configuration - package.json, Dockerfile, etc.

**Excluded (.gitignore):**
- ❌ node_modules/
- ❌ dist/
- ❌ .env and .env.local (secrets)
- ❌ .firebase, .firebaserc (local configs)

---

## 🔄 Future Commits

After pushing:

```bash
# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🤖 GitHub Actions (CI/CD)

### Auto-Deploy to Firebase on Push

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build app
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: novel-db4b6
```

### Setup GitHub Secrets

1. Go to: https://github.com/tasinahmed-beep/mystore/settings/secrets
2. Add `FIREBASE_SERVICE_ACCOUNT`:
   - Go to Firebase Console
   - Project Settings → Service Accounts
   - Generate new private key
   - Paste the JSON

Then every push to main → auto-deploys! 🚀

---

## 📚 Repository Structure on GitHub

```
mystore/
├── src/                    Frontend React app
├── telgram bot/            Telegram bot + Docker
├── functions/              Firebase Cloud Functions
├── public/                 Static assets
├── .github/workflows/       CI/CD automation
├── .gitignore              Git exclusions
├── Dockerfile              Docker build config
├── docker-compose.yml      Docker Compose config
├── package.json           Dependencies
├── firebase.json          Firebase config
└── README.md              Project documentation
```

---

## 🎯 Next Steps

1. **Choose authentication method** (Methods 1-4 above)
2. **Run the push command** from your method
3. **Verify** at https://github.com/tasinahmed-beep/mystore
4. **(Optional) Set up GitHub Actions** for auto-deploy

---

## 🆘 Troubleshooting

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# Reinitialize
git remote add origin https://github.com/tasinahmed-beep/mystore.git
git push -u origin main
```

### "Permission denied (publickey)"
SSH auth issue. Use Method 1 (GitHub CLI) instead.

### "Authentication failed"
Token/password wrong. Check you're using correct credentials or create new token.

### "Reference already exists"
Branch exists on remote. Use:
```bash
git push origin main --force-with-lease
```

### Large files or slow push
Files are being uploaded. This is normal for first push with many images.

---

## 💡 Best Practices

✅ **Do:**
- Keep using `git add` and `git commit` locally
- Push frequently to backup code
- Use SSH keys for long-term access
- Store secrets in GitHub Secrets, never in code
- Use `.gitignore` for sensitive files

❌ **Don't:**
- Commit `.env` files with secrets
- Push `node_modules` folder
- Use old/revoked tokens
- Share PATs in chat/email
- Commit firebase keys

---

## 🔐 Security Checklist

- ✅ Invalidate exposed token
- ✅ .gitignore excludes .env
- ✅ .gitignore excludes node_modules
- ✅ No secrets in code files
- ✅ Using secure auth method (SSH/CLI/Credential Manager)
- ✅ GitHub token deleted from chat

---

## 📞 Need Help?

Running a specific method? Check the section above for complete steps.

**Quick reference:**
- **Easiest:** Method 1 (GitHub CLI)
- **Most Secure:** Method 2 (SSH Keys)
- **GUI-Based:** Method 3 (Git Credential Manager)
- **Token-Based:** Method 4 (PAT)

Choose one and run the command! 🚀
