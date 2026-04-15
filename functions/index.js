import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";

// Initialize Firebase Admin
admin.initializeApp();

// Get environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;
const GROUP_NAME = process.env.GROUP_NAME || "T Shop Support";
const STORE_URL = process.env.STORE_URL || "https://tdigitalstore.web.app";

// Validate required environment variables
if (!BOT_TOKEN) {
  console.error("❌ ERROR: Missing BOT_TOKEN");
}

if (!OWNER_CHAT_ID || OWNER_CHAT_ID === "YOUR_CHAT_ID_HERE") {
  console.error("❌ ERROR: Missing OWNER_CHAT_ID");
}

// Create Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const lastAutoReplyAt = new Map();
const AUTO_REPLY_COOLDOWN_MS = 20 * 60 * 1000;

// Format currency based on payment method
function formatCurrency(order, amount) {
  return order.paymentMethod === "binance"
    ? `$${Number(amount).toFixed(2)}`
    : `৳${new Intl.NumberFormat("en-BD").format(Number(amount))}`;
}

// Build order message with rich formatting
function buildOrderMessage(storeName, supportUsername, order) {
  const lines = [
    `<b>🛍️ 🎯 ${storeName} NEW ORDER 🎉</b>`,
    "",
    "<b>👤 CUSTOMER DETAILS 📋</b>",
    `<i>📛 Name:</i> <b>${order.customerName}</b>`,
    `<i>📧 Email:</i> <code>${order.customerEmail}</code>`,
    `<i>💬 Telegram/WhatsApp:</i> <b>${order.customerTelegram || "❌ Not provided"}</b>`,
    "",
    "<b>📦 ORDER SUMMARY 💳</b>",
    `<i>🆔 Order Code:</i> <code>${order.code}</code>`,
    `<i>💰 Payment Method:</i> <b>${order.paymentMethod === "binance" ? "🪙 Crypto (USDT)" : "🏦 Local (BDT)"}</b>`,
    `<i>💵 Total:</i> <b>${formatCurrency(order, order.totalAmount)}</b>`,
    "",
    "<b>🧾 PRODUCTS 📦</b>",
    ...order.items.flatMap((item, index) => [
      `${index + 1}. <b>📱 ${item.productName}</b>`,
      `   ➡️ <i>Quantity:</i> <b>${item.quantity}x</b>`,
      `   ➡️ <i>Unit Price:</i> <code>${formatCurrency(order, item.unitPrice)}</code>`,
      `   🔗 <a href="${STORE_URL}/#product-${item.productId}">View Product</a>`,
    ]),
    "",
    "<i>━━━━━━━━━━━━━━━━━━━━━</i>",
    `<b>📬 SUPPORT:</b> <a href="https://t.me/${supportUsername}">@${supportUsername}</a>`,
    `<b>⏰ Status:</b> <i>✅ Order Received & Processing</i>`,
  ];

  return lines.join("\n");
}

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "T Shop Telegram Bot", timestamp: new Date().toISOString() });
});

// Send order to Telegram
app.post("/send-order", async (req, res) => {
  try {
    const { storeName = "T Shop", supportUsername = "", order } = req.body ?? {};
    
    if (!order?.code || !Array.isArray(order?.items) || order.items.length === 0) {
      return res.status(400).json({ ok: false, error: "Invalid order payload" });
    }

    // Send celebration sticker
    try {
      await bot.sendSticker(OWNER_CHAT_ID, "CAACAgIAAxkBAAIErWd3Z8N4-VPIVwZVp0mGiN7VHQVoAAKwAAySBzI1L8F1ZJHx_2BuBA");
    } catch (err) {
      console.log("Sticker send skipped (optional)");
    }

    // Send rich HTML formatted message
    const text = buildOrderMessage(storeName, supportUsername, order);
    await bot.sendMessage(OWNER_CHAT_ID, text, {
      parse_mode: "HTML",
      disable_web_page_preview: false,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("send-order failed", error);
    return res.status(500).json({ ok: false, error: "Failed to send order" });
  }
});

// Auto-reply to messages
bot.on("message", async (message) => {
  if (!message.chat || message.from?.is_bot) {
    return;
  }

  const chatId = String(message.chat.id);
  if (chatId === String(OWNER_CHAT_ID)) {
    return;
  }

  const now = Date.now();
  const lastReply = lastAutoReplyAt.get(chatId) ?? 0;
  if (now - lastReply < AUTO_REPLY_COOLDOWN_MS) {
    return;
  }

  lastAutoReplyAt.set(chatId, now);

  // Send welcome sticker
  try {
    await bot.sendSticker(message.chat.id, "CAACAgIAAxkBAAIErWd3Z8N4-VPIVwZVp0mGiN7VHQVoAAKwAAySBzI1L8F1ZJHx_2BuBA");
  } catch (err) {
    console.log("Sticker send skipped (optional)");
  }

  const reply = [
    "<b>👋 Welcome to T Shop! 🎉</b>",
    "",
    "<i>Thank you for reaching out! 💌</i>",
    "",
    "⏳ <b>Response Time:</b> <i>~20 minutes ⏱️</i>",
    "✅ Our amazing team is standing by to help you! 🚀",
    "",
    "📝 <b>While you wait:</b>",
    "🛍️ <a href=\"" + STORE_URL + "\">Browse our store</a>",
    "📖 <a href=\"" + STORE_URL + "\">View all products</a>",
    "",
    `👥 <b>Support Group:</b> ${GROUP_NAME}`,
    "",
    "<i>━━━━━━━━━━━━━━━━━━━━━━━</i>",
    "💎 <b>Premium Quality Products</b>",
    "🔒 <b>100% Secure Transactions</b>",
    "⚡ <b>Fast Delivery</b>",
  ].join("\n");

  try {
    await bot.sendMessage(message.chat.id, reply, {
      parse_mode: "HTML",
      disable_web_page_preview: false,
    });
  } catch (error) {
    console.error("auto-reply failed", error);
  }
});

// Export Cloud Function
export const botApi = functions.https.onRequest(app);
