# Use Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY bot.py ./

# Create non-root user for security
RUN useradd -m -u 1001 botuser
USER botuser

# Run the bot
CMD ["python", "bot.py"]
