import cors from "cors";
import express from "express";
import TelegramBot from "node-telegram-bot-api";

const {
  BOT_TOKEN,
  OWNER_CHAT_ID,
  GROUP_NAME = "T Shop Support",
  STORE_URL = "http://localhost:5173",
  PORT = "3001",
} = process.env;

if (!BOT_TOKEN) {
  console.error('❌ ERROR: Missing BOT_TOKEN in .env.local');
  console.error('   Get token from @BotFather on Telegram');
  process.exit(1);
}

if (!OWNER_CHAT_ID || OWNER_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
  console.error('❌ ERROR: Missing OWNER_CHAT_ID in .env.local');
  console.error('   Steps to get Chat ID:');
  console.error('   1. Message @TStoreDigitalbot');
  console.error('   2. Run: node quick-setup.mjs');
  console.error('   3. Follow prompts');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const lastAutoReplyAt = new Map();
const AUTO_REPLY_COOLDOWN_MS = 20 * 60 * 1000;

function formatCurrency(order, amount) {
  return order.paymentMethod === "binance"
    ? `$${Number(amount).toFixed(2)}`
    : `৳${new Intl.NumberFormat("en-BD").format(Number(amount))}`;
}

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/send-order", async (req, res) => {
  try {
    const { storeName = "T Shop", supportUsername = "", order } = req.body ?? {};
    if (!order?.code || !Array.isArray(order?.items) || order.items.length === 0) {
      return res.status(400).json({ ok: false, error: "Invalid order payload" });
    }

    // Send celebration sticker first 🎉
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

  // Send welcome sticker 👋
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

app.listen(Number(PORT), () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🤖 T SHOP TELEGRAM BOT STARTED       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`  Bot: @TStoreDigitalbot`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Store: ${STORE_URL}`);
  console.log(`  Status: ✅ RUNNING`);
  console.log('');
  console.log('  Ready to receive orders from cart!');
  console.log('');
});
