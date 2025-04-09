#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting backend deployment..."

# Load environment variables
if [ -f .env.production ]; then
    echo "📝 Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ .env.production file not found!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🏗️ Building the application..."
npm run build

# Stop existing PM2 process if running
echo "🛑 Stopping existing PM2 process..."
pm2 stop ecommerce-api || true
pm2 delete ecommerce-api || true

# Start the application with PM2
echo "🚀 Starting the application with PM2..."
pm2 start server.js --name "ecommerce-api" --time

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Setup PM2 to start on system reboot
echo "⚙️ Setting up PM2 startup..."
pm2 startup

echo "✅ Backend deployment completed successfully!" 