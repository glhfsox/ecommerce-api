#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting full deployment..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Deploy backend
echo "🔄 Deploying backend..."
./scripts/deploy-backend.sh

# Deploy frontend
echo "🔄 Deploying frontend..."
./scripts/deploy-frontend.sh

# Check if Nginx is installed and running
if command -v nginx &> /dev/null; then
    echo "🔄 Reloading Nginx configuration..."
    sudo nginx -t && sudo systemctl reload nginx
fi

# Run health check
echo "🔍 Running health check..."
sleep 5 # Wait for services to start
curl -f http://localhost:3000/api/health || {
    echo "❌ Health check failed!"
    exit 1
}

echo "✅ Full deployment completed successfully!" 