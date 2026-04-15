#!/usr/bin/env python3
"""
T Store Auto-Reply Bot - Python Version
Responds to messages in personal Telegram account with store visit message
Runs on ClawCloud or any Python-enabled server
"""

import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Load .env.local only if running locally (file exists and not in Docker)
if os.path.exists('.env.local') and not os.path.exists('/.dockerenv'):
    load_dotenv('.env.local', override=False)
    print("📄 Loaded .env.local from local development")

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Store variables
CHANNEL_LINK = "https://t.me/tstoredigital2508"  # Main store channel
SUPPORT_LINK = "https://t.me/tstoredigital250"  # Support/personal account


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    await update.message.reply_text(
        f"👋 <b>Welcome to T Store! 🎉</b>\n\n"
        f"✨ <b>Amazing digital products & services</b> ✨\n\n"
        f"📢 <a href=\"{CHANNEL_LINK}\"><b>👉 JOIN OUR CHANNEL 👈</b></a>\n"
        f"💬 <a href=\"{SUPPORT_LINK}\"><b>Support & Questions</b></a>\n\n"
        f"⏱️ I'll respond to your messages shortly!",
        parse_mode='HTML'
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    await update.message.reply_text(
        f"<b>🤖 T Store Bot</b>\n\n"
        f"<b>� Store Channel:</b>\n"
        f"<a href=\"{CHANNEL_LINK}\"><b>👉 Visit Channel</b></a>\n\n"
        f"<b>💬 Need Support?</b>\n"
        f"<a href=\"{SUPPORT_LINK}\"><b>Contact Us</b></a>\n\n"
        f"✨ Amazing products!\n"
        f"🚀 Fast & secure checkout",
        parse_mode='HTML'
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming messages with auto-reply."""
    await update.message.reply_text(
        "⏳ <b>Please wait...</b> 👀\n\n"
        f"<b>✨ Thank you for reaching out! ✨</b>\n"
        f"Our team is reviewing your message...\n\n"
        f"📢 <b>While you wait:</b>\n"
        f"<a href=\"{CHANNEL_LINK}\"><b>👉 Join Our Channel</b></a>\n"
        f"<a href=\"{SUPPORT_LINK}\"><b>💬 Support Chat</b></a>\n\n"
        f"💎 <b>Fresh products added daily!</b>\n"
        f"🚀 <b>Fast checkout • Secure payment</b>\n\n"
        f"⭐ See you! ⭐",
        parse_mode='HTML'
    )


async def error(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log the error and send a telegram message to notify the developer."""
    logger.warning(f'Update "{update}" caused error "{context.error}"')


def main() -> None:
    """Start the bot."""
    
    # Get token from environment
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    
    if not token or "OWNER_CHAT_ID" in token:
        raise ValueError(
            "❌ Invalid TELEGRAM_BOT_TOKEN environment variable.\n"
            "Expected format: 8733289509:AAEZaj...\n"
            f"Got: {token[:50]}..." if token else "Not set"
        )
    
    # Validate token format (should be number:string)
    if ":" not in token:
        raise ValueError(f"❌ Invalid token format: {token[:50]}...")
    
    # Create the Application
    application = Application.builder().token(token).build()

    # Register handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    
    # Handle all other messages
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Error handler
    application.add_error_handler(error)

    # Start the Bot
    print("\n" + "="*60)
    print("🤖 T STORE AUTO-REPLY BOT (PYTHON)")
    print("="*60)
    print("✅ Bot is running")
    print(f"� Channel: {CHANNEL_LINK}")
    print(f"💬 Support: {SUPPORT_LINK}")
    print(f"⏳ Listening for messages in your personal account...")
    print("="*60 + "\n")
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
