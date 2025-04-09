#!/bin/bash

# Exit on error
set -e

echo "🔄 Starting rollback..."

# Rollback backend
echo "🔄 Rolling back backend..."
pm2 stop ecommerce-api || true
pm2 delete ecommerce-api || true

# Find the most recent backup
LATEST_BACKUP=$(ls -dt dist_backup_* | head -n 1)

if [ -n "$LATEST_BACKUP" ]; then
    echo "📦 Restoring from backup: $LATEST_BACKUP"
    
    # Remove current dist if it exists
    if [ -d "frontend/dist" ]; then
        rm -rf frontend/dist
    fi
    
    # Restore from backup
    mv "$LATEST_BACKUP" frontend/dist
    
    # Restart the application
    echo "🚀 Restarting the application..."
    pm2 start server.js --name "ecommerce-api" --time
    pm2 save
    
    echo "✅ Rollback completed successfully!"
else
    echo "❌ No backup found to rollback to!"
    exit 1
fi 