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

# Load .env.local if it exists (for local development)
load_dotenv('.env.local', override=False)

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Store variables
STORE_LINK = "https://t.me/tstoredigital25"


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    await update.message.reply_text(
        f"👋 Welcome to T Store!\n\n"
        f"🏪 Visit our store: {STORE_LINK}\n\n"
        f"I'll respond to your messages shortly!"
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    await update.message.reply_text(
        f"🤖 T Store Bot\n\n"
        f"📍 Store: {STORE_LINK}\n\n"
        f"I'm here to help! Visit our store for updates."
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming messages with auto-reply."""
    await update.message.reply_text(
        "⏳ <b>Please wait...</b>\n\n"
        "Thank you for your message! Our team is looking at it.\n\n"
        f"🏪 <b>In the meantime, visit our store:</b>\n"
        f"{STORE_LINK}\n\n"
        "✨ We have amazing products and deals waiting for you!",
        parse_mode='HTML'
    )


async def error(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log the error and send a telegram message to notify the developer."""
    logger.warning(f'Update "{update}" caused error "{context.error}"')


def main() -> None:
    """Start the bot."""
    
    # Get token from environment
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("❌ TELEGRAM_BOT_TOKEN environment variable not set")
    
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
    print(f"📍 Store: {STORE_LINK}")
    print(f"⏳ Listening for messages in your personal account...")
    print("="*60 + "\n")
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
