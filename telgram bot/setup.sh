#!/bin/bash
# Setup script for Telegram Bot Integration

echo "🤖 T Shop Telegram Bot Setup"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local found"
    
    # Check if BOT_TOKEN is set
    if grep -q "^BOT_TOKEN=" .env.local; then
        echo "✅ BOT_TOKEN is configured"
    else
        echo "⚠️  BOT_TOKEN not found in .env.local"
    fi
    
    # Check if OWNER_CHAT_ID is set
    if grep -q "^OWNER_CHAT_ID=" .env.local; then
        echo "✅ OWNER_CHAT_ID is configured"
    else
        echo "⚠️  OWNER_CHAT_ID not found in .env.local"
    fi
else
    echo "❌ .env.local not found"
    echo ""
    echo "📋 Quick Setup Steps:"
    echo "1. Copy .env.example to .env.local"
    echo "2. Get BOT_TOKEN from @BotFather on Telegram"
    echo "3. Get OWNER_CHAT_ID by:"
    echo "   - Message your bot"
    echo "   - Visit: https://api.telegram.org/bot<TOKEN>/getUpdates"
    echo "   - Find your chat ID"
    echo "4. Update .env.local with your values"
    echo ""
    exit 1
fi

echo ""
echo "📦 Dependencies:"
npm list node-telegram-bot-api express cors > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ All dependencies installed"
else
    echo "📥 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting Telegram Bot..."
echo "Bot API will be available at: http://localhost:3001"
echo ""
echo "📝 Testing endpoints:"
echo "  Health: curl http://localhost:3001/health"
echo ""
echo "⏹️  Press Ctrl+C to stop"
echo ""

npm start
