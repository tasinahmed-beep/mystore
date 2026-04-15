# Windows Setup script for Telegram Bot Integration
# Run in PowerShell

Write-Host "🤖 T Shop Telegram Bot Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local found" -ForegroundColor Green
    
    # Check if BOT_TOKEN is set
    $envContent = Get-Content ".env.local"
    if ($envContent -match "^BOT_TOKEN=") {
        Write-Host "✅ BOT_TOKEN is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  BOT_TOKEN not found in .env.local" -ForegroundColor Yellow
    }
    
    # Check if OWNER_CHAT_ID is set
    if ($envContent -match "^OWNER_CHAT_ID=") {
        Write-Host "✅ OWNER_CHAT_ID is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  OWNER_CHAT_ID not found in .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Quick Setup Steps:" -ForegroundColor Yellow
    Write-Host "1. Copy .env.example to .env.local"
    Write-Host "2. Get BOT_TOKEN from @BotFather on Telegram"
    Write-Host "3. Get OWNER_CHAT_ID by:"
    Write-Host "   - Message your bot"
    Write-Host "   - Visit: https://api.telegram.org/bot<TOKEN>/getUpdates"
    Write-Host "   - Find your chat ID"
    Write-Host "4. Update .env.local with your values"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
npm list node-telegram-bot-api express cors --depth=0 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All dependencies installed" -ForegroundColor Green
} else {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Starting Telegram Bot..." -ForegroundColor Green
Write-Host "Bot API will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Testing endpoints:" -ForegroundColor Cyan
Write-Host "  Health: curl http://localhost:3001/health" -ForegroundColor Gray
Write-Host ""
Write-Host "⏹️  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm start
