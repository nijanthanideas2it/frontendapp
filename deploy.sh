#!/bin/bash

# Frontend Deployment Script for Render.com

echo "🚀 Starting frontend deployment..."

# Build the application
echo "📦 Building application..."
npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in ./dist directory"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push your code to Git repository"
    echo "2. Connect your repository to Render.com"
    echo "3. Deploy using the render.yaml configuration"
    echo ""
    echo "🌐 Your app will be available at: https://your-app-name.onrender.com"
else
    echo "❌ Build failed!"
    exit 1
fi 