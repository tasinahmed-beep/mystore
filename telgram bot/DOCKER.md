# Docker Guide - T Shop Telegram Bot

Run the Telegram bot in a Docker container for easy deployment and isolation.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed
- `.env.local` file with bot credentials

## Quick Start

### 1. Build Docker Image

```bash
cd "telgram bot"
docker build -t t-shop-bot:latest .
```

Expected output:
```
Sending build context to Docker daemon  ...  MB
Step 1/15 : FROM node:20-alpine AS builder
...
Successfully tagged t-shop-bot:latest
```

### 2. Run Container

**Option A: Simple run command**
```bash
docker run -d \
  --name t-shop-bot \
  --restart unless-stopped \
  -p 3001:3001 \
  -e BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4 \
  -e OWNER_CHAT_ID=7773751516 \
  -e GROUP_NAME="T Shop Support" \
  -e STORE_URL=https://tdigitalstore.web.app \
  t-shop-bot:latest
```

**Option B: Using docker-compose (RECOMMENDED)**
```bash
# Create .env file in telgram bot folder
echo "BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4" > .env
echo "OWNER_CHAT_ID=7773751516" >> .env
echo "GROUP_NAME=T Shop Support" >> .env
echo "STORE_URL=https://tdigitalstore.web.app" >> .env

# Start bot with docker-compose
docker-compose up -d

# Or rebuild and start
docker-compose up -d --build
```

### 3. Verify Bot is Running

```bash
# Check container status
docker ps | grep t-shop-bot

# View logs
docker logs t-shop-bot

# Test health endpoint
curl http://localhost:3001/api/health

# Should return:
# {"ok":true}
```

## Docker Commands Reference

### Build Commands

```bash
# Build image with specific tag
docker build -t t-shop-bot:1.0 .

# Build and show build progress
docker build --progress=plain -t t-shop-bot:latest .

# Build without cache (rebuild everything)
docker build --no-cache -t t-shop-bot:latest .
```

### Run Commands

```bash
# Run in background (detached)
docker run -d --name bot-prod t-shop-bot:latest

# Run in foreground (see logs)
docker run --name bot-test t-shop-bot:latest

# Run with custom port
docker run -d -p 5000:3001 --name bot-alt t-shop-bot:latest

# Run with environment variables
docker run -d \
  -e BOT_TOKEN=your_token \
  -e OWNER_CHAT_ID=your_id \
  --name t-shop-bot \
  t-shop-bot:latest
```

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View logs
docker logs t-shop-bot

# Follow logs in real-time
docker logs -f t-shop-bot

# Show only last 100 lines
docker logs --tail 100 t-shop-bot

# Stop container
docker stop t-shop-bot

# Start stopped container
docker start t-shop-bot

# Restart container
docker restart t-shop-bot

# Remove container
docker rm t-shop-bot

# Remove image
docker rmi t-shop-bot:latest

# Check container stats (CPU, memory)
docker stats t-shop-bot
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart

# Pull latest images
docker-compose pull

# View running services
docker-compose ps
```

## Configuration

### Environment Variables

Set these in `.env` file or via `-e` flag:

```
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
PORT=3001
NODE_ENV=production
```

### Custom Port

```bash
# Run on port 5000
docker run -d -p 5000:3001 \
  -e PORT=3001 \
  -e BOT_TOKEN=your_token \
  -e OWNER_CHAT_ID=your_id \
  t-shop-bot:latest
```

Then access at: `http://localhost:5000/api/health`

## Docker Compose Setup

### 1. Create `.env` File

```bash
cd "telgram bot"
cat > .env << EOF
BOT_TOKEN=8733289509:AAEZaj-cnC6Aq6UvDPWYUwY9vXq49jimfv4
OWNER_CHAT_ID=7773751516
GROUP_NAME=T Shop Support
STORE_URL=https://tdigitalstore.web.app
PORT=3001
EOF
```

### 2. Start Services

```bash
# First time - builds and starts
docker-compose up -d

# Subsequent times - just starts
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Update Code and Redeploy

```bash
# Update Dockerfile or code
# Then rebuild and restart:
docker-compose up -d --build

# Or manually:
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Container won't start

```bash
# View error logs
docker logs t-shop-bot

# Check if port is in use
netstat -ano | findstr :3001

# Kill process using port
taskkill /PID 1234 /F
```

### Bot not receiving messages

```bash
# Check environment variables
docker exec t-shop-bot env | grep BOT_TOKEN

# Verify bot token is correct
curl http://localhost:3001/api/health

# Check logs for errors
docker logs -f t-shop-bot
```

### Out of memory/CPU issues

```bash
# Limit memory (512MB max)
docker run -d -m 512m \
  --cpus="0.5" \
  -e BOT_TOKEN=your_token \
  t-shop-bot:latest

# Check resource usage
docker stats t-shop-bot
```

### Container keeps stopping

Check logs:
```bash
docker logs t-shop-bot
```

Common issues:
- Missing BOT_TOKEN or OWNER_CHAT_ID
- Invalid bot token
- Port already in use
- Network issues

## Production Deployment

### On Linux Server

```bash
# SSH into server
ssh user@server.com

# Clone or upload code to /opt/t-shop-bot
cd /opt/t-shop-bot/telgram\ bot

# Create .env with production values
nano .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Auto-restart on boot
sudo systemctl enable docker
```

### Docker Hub Deployment

```bash
# Tag image for Docker Hub
docker tag t-shop-bot:latest username/t-shop-bot:latest

# Login to Docker Hub
docker login

# Push image
docker push username/t-shop-bot:latest

# On another machine, pull and run
docker pull username/t-shop-bot:latest
docker run -d -e BOT_TOKEN=... -e OWNER_CHAT_ID=... username/t-shop-bot:latest
```

### With Reverse Proxy (Nginx)

**docker-compose.yml** with nginx:
```yaml
version: '3.8'

services:
  t-shop-bot:
    build: .
    restart: unless-stopped
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - OWNER_CHAT_ID=${OWNER_CHAT_ID}
      - PORT=3001
    expose:
      - "3001"
    networks:
      - t-shop-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - t-shop-bot
    networks:
      - t-shop-network

networks:
  t-shop-network:
```

## File Structure

```
telgram bot/
├── Dockerfile              (Multi-stage build)
├── docker-compose.yml      (Compose configuration)
├── .dockerignore           (What to exclude from build)
├── .env                    (Environment variables - DO NOT COMMIT)
├── .env.example            (Template - COMMIT THIS)
├── server.js               (Bot application)
├── package.json            (Dependencies)
└── DOCKER.md               (This file)
```

## Best Practices

✅ **Do:**
- Use `.env` files for credentials (never hardcode)
- Add health checks
- Use `restart: unless-stopped` for auto-recovery
- Limit resource usage (memory, CPU)
- Use healthchecks to verify container health
- Keep images small (use Alpine Linux)
- Use specific Node version (20-alpine)

❌ **Don't:**
- Run as root user
- Put secrets in Dockerfile
- Commit `.env` file to git
- Use `latest` tag in production (use versioned tags)
- Expose unnecessary ports
- Leave debug logging on in production

## Size Optimization

Current image size: ~150MB

To reduce further:
```dockerfile
# Remove dev dependencies (already done with --omit=dev)
# Use Alpine Linux (already done with :20-alpine)
# Remove dumb-init if unnecessary
```

## Security Checklist

✅ Non-root user runs container
✅ Health checks enabled
✅ Secrets via environment variables
✅ Alpine Linux for small surface area
✅ Minimal dependencies
✅ Multi-stage build to reduce size
✅ dumb-init for proper signal handling

## Useful Docker Tips

### View build layers
```bash
docker history t-shop-bot:latest
```

### Inspect running container
```bash
docker inspect t-shop-bot
```

### Execute command in container
```bash
docker exec t-shop-bot npm --version
```

### Copy files from container
```bash
docker cp t-shop-bot:/app/server.js ./
```

### Get shell access
```bash
docker exec -it t-shop-bot sh
```

## Next Steps

1. **Build image:** `docker build -t t-shop-bot:latest .`
2. **Run container:** `docker-compose up -d`
3. **Verify:** `curl http://localhost:3001/api/health`
4. **Check logs:** `docker-compose logs -f`
5. **Test orders:** Add to cart and checkout

## Support

For Docker issues:
- Check logs: `docker-compose logs -f`
- Test health: `curl http://localhost:3001/api/health`
- Verify env vars: `docker exec t-shop-bot env`

For bot issues:
- Verify BOT_TOKEN is correct
- Check OWNER_CHAT_ID is valid
- Make sure bot is in correct chat group
