#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 T Shop Firebase Cloud Functions Deployment");
console.log("═".repeat(50));

const rootDir = path.resolve(__dirname);
const functionsDir = path.join(rootDir, "functions");

// Step 1: Check Firebase CLI
console.log("\n📋 Checking Firebase CLI...");
try {
  execSync("firebase --version", { stdio: "pipe" });
  console.log("✅ Firebase CLI found");
} catch {
  console.error("❌ Firebase CLI not found. Install with: npm install -g firebase-tools");
  process.exit(1);
}

// Step 2: Check .env.local
console.log("\n📋 Checking environment files...");
const envPath = path.join(functionsDir, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ functions/.env.local not found");
  console.log("Create it with:");
  console.log("  BOT_TOKEN=your_token");
  console.log("  OWNER_CHAT_ID=your_chat_id");
  process.exit(1);
}
console.log("✅ functions/.env.local found");

// Step 3: Install dependencies
console.log("\n📋 Installing dependencies...");
try {
  console.log("  Installing root dependencies...");
  execSync("npm install", { cwd: rootDir, stdio: "inherit" });
  
  console.log("  Installing functions dependencies...");
  execSync("npm install", { cwd: functionsDir, stdio: "inherit" });
  console.log("✅ Dependencies installed");
} catch (error) {
  console.error("❌ Failed to install dependencies");
  process.exit(1);
}

// Step 4: Deploy to Firebase
console.log("\n📋 Deploying to Firebase...");
try {
  execSync("firebase deploy", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Deployment complete!");
  console.log("\n🎉 Success! Bot available at:");
  console.log("   https://tdigitalstore.web.app/api/send-order");
  console.log("   https://novel-db4b6.web.app/api/send-order");
} catch (error) {
  console.error("❌ Deployment failed");
  process.exit(1);
}
