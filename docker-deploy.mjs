#!/usr/bin/env node

/**
 * Docker Deployment Helper
 * Run: node docker-deploy.mjs
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BOT_TOKEN = process.env.BOT_TOKEN || '8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4';
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID || '7773751516';

console.log(`
╔════════════════════════════════════════════════════════════╗
║      🐳 T Shop Bot - Docker Deployment Helper 🐳          ║
╚════════════════════════════════════════════════════════════╝
`);

function run(cmd, description) {
  console.log(`\n▶️  ${description}...`);
  console.log(`   Command: ${cmd}\n`);
  try {
    const output = execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${description} successful!\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed!\n`);
    return false;
  }
}

const commands = [
  {
    cmd: `docker compose -f docker-compose.prod.yml up -d`,
    desc: '1️⃣  Pull and run bot from GitHub image',
  },
  {
    cmd: `docker compose -f docker-compose.prod.yml logs -f`,
    desc: '2️⃣  View bot logs (press Ctrl+C to stop)',
  },
  {
    cmd: `docker compose -f docker-compose.prod.yml down`,
    desc: '3️⃣  Stop and remove bot container',
  },
];

console.log(`
Environment Variables Set:
  BOT_TOKEN: ${BOT_TOKEN.substring(0, 20)}...
  OWNER_CHAT_ID: ${OWNER_CHAT_ID}

Workflow:
1. ✅ GitHub Actions runs on main branch push
2. ✅ Builds Docker image with Dockerfile
3. ✅ Pushes to: ghcr.io/tasinahmed-beep/mystore/t-shop-bot:latest
4. 💥 Deploy to Railway (if RAILWAY_TOKEN is set)

Quick Commands:
`);

commands.forEach((cmd, i) => {
  console.log(`\n${i + 1}. ${cmd.desc}`);
  console.log(`   \`${cmd.cmd}\``);
});

console.log(`

📌 First Run:
   docker compose -f docker-compose.prod.yml up -d

📌 View Logs:
   docker compose -f docker-compose.prod.yml logs -f

📌 Stop Bot:
   docker compose -f docker-compose.prod.yml down

📌 Check Status:
   docker ps | grep t-shop-bot
`);
