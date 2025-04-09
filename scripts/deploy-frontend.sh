#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting frontend deployment..."

# Navigate to frontend directory
cd frontend

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
npm install

# Build the application
echo "🏗️ Building the application..."
npm run build

# Create backup of current build
echo "💾 Creating backup of current build..."
if [ -d "dist" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mv dist "dist_backup_$TIMESTAMP"
fi

# Move new build to dist directory
echo "📁 Moving new build to dist directory..."
mv build dist

# Clean up old backups (keep last 3)
echo "🧹 Cleaning up old backups..."
ls -dt dist_backup_* | tail -n +4 | xargs rm -rf

echo "✅ Frontend deployment completed successfully!" 