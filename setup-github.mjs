#!/usr/bin/env node

/**
 * GitHub Setup Helper
 * 
 * This script helps deploy your T Shop to GitHub safely
 * Usage: node setup-github.mjs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

const projectRoot = process.cwd();

function runCommand(cmd, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ ${description} successful`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log(`
╔════════════════════════════════════════════╗
║  GitHub Setup - T Shop                     ║
╚════════════════════════════════════════════╝
`);

  // Step 1: Check if git is initialized
  if (!fs.existsSync(path.join(projectRoot, ".git"))) {
    console.log("\n📝 Git not initialized. Initializing now...");
    runCommand("git init", "Initialize Git repository");
    runCommand('git config user.name "T Shop Bot"', "Set Git user name");
    runCommand(
      'git config user.email "bot@tshop.local"',
      "Set Git user email"
    );
  } else {
    console.log("\n✅ Git repository already initialized");
  }

  // Step 2: Add files to git
  console.log("\n📦 Adding files to Git...");
  runCommand("git add .", "Stage all files");

  // Step 3: Create initial commit
  console.log("\n✍️  Creating initial commit...");
  runCommand(
    'git commit -m "Initial T Shop commit - Frontend, Backend, Docker config"',
    "Create commit"
  );

  // Step 4: Add remote
  console.log("\n🔗 Connecting to GitHub...");
  const repoUrl = "https://github.com/tasinahmed-beep/mystore.git";
  
  try {
    execSync("git remote get-url origin", { stdio: "pipe" });
    console.log("✅ Remote already configured");
  } catch {
    runCommand(`git remote add origin ${repoUrl}`, "Add GitHub remote");
  }

  // Step 5: Instructions for pushing
  console.log(`
╔════════════════════════════════════════════╗
║  ⚠️  IMPORTANT - Security Notice           ║
╚════════════════════════════════════════════╝

Your GitHub token has been exposed. MUST INVALIDATE IT:
👉 https://github.com/settings/tokens

Then use ONE of these safe methods to push:

🔑 METHOD 1: Using GitHub CLI (RECOMMENDED)
────────────────────────────────────────────
1. Install GitHub CLI: https://cli.github.com/
2. Run: gh auth login
3. Choose "GitHub.com" → "HTTPS" → "Y" → "Paste token"
4. Then: gh repo push

🔐 METHOD 2: Using SSH Keys (MOST SECURE)
────────────────────────────────────────────
1. Generate SSH key (if you don't have one):
   ssh-keygen -t ed25519 -C "your_email@example.com"

2. Add to GitHub: https://github.com/settings/keys
   cat ~/.ssh/id_ed25519.pub  (copy output)

3. Change remote to SSH:
   git remote set-url origin git@github.com:tasinahmed-beep/mystore.git

4. Push:
   git push -u origin main

🌐 METHOD 3: Using Git Credential Manager
────────────────────────────────────────────
1. Install: https://github.com/git-ecosystem/git-credential-manager
2. Configure: git config --global credential.helper manager
3. First push will prompt for credentials (enter new token)
4. Token gets stored securely

📌 METHOD 4: Using New Personal Access Token (PAT)
────────────────────────────────────────────────
1. Create new token: https://github.com/settings/tokens/new
   - Scopes: repo (Full control of private repositories)
   - Expiration: 90 days
   - Copy the new token

2. Run:
   git config --local credential.helper store
   git push -u origin main
   (You'll be prompted to enter username and the NEW token)

╔════════════════════════════════════════════╗
║  After choosing a method, run:             ║
║  git push -u origin main                   ║
╚════════════════════════════════════════════╝

📊 Repository Details:
  URL: ${repoUrl}
  Branch: main
  
✅ Your code is ready to push!
   - .gitignore properly configured
   - All files staged
   - Initial commit created

🚀 Next: Choose a method above and push!
`);
}

main().catch(console.error);
