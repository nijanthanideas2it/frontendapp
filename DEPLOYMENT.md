# Frontend Deployment Guide for Render.com

## Prerequisites
- Render.com account
- Git repository with your frontend code

## Deployment Steps

### 1. Prepare Your Repository
Make sure your repository contains:
- `package.json` with build scripts
- `vite.config.ts` configured for production
- `render.yaml` (already created)
- `.nvmrc` (already created)

### 2. Deploy to Render.com

#### Option A: Using Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Static Site"
3. Connect your Git repository
4. Configure the following settings:
   - **Name**: `projexiq-frontend`
   - **Build Command**: `npm install && npm run build:prod`
   - **Publish Directory**: `dist`
   - **Environment**: Static Site

#### Option B: Using render.yaml (Recommended)
1. Push your code to Git repository
2. In Render Dashboard, create a new "Blueprint" service
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

### 3. Environment Variables
No environment variables are needed for the frontend as it's a static site.

### 4. Custom Domain (Optional)
1. In your Render service settings, go to "Settings" → "Custom Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

### 5. Verify Deployment
- Your app will be available at: `https://your-app-name.onrender.com`
- The frontend will communicate with your backend at: `https://projexiq.onrender.com`

## Build Process
The deployment will:
1. Install Node.js 18.17.0
2. Run `npm install` to install dependencies
3. Run `npm run build:prod` to build the production version
4. Serve the static files from the `dist` directory

## Quick Deployment Steps

### 1. Test Build Locally
```bash
cd frontend
npm run build:prod
```

### 2. Deploy to Render.com
1. Push your code to Git repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create new "Blueprint" service
4. Connect your repository
5. Render will use the `render.yaml` configuration automatically

### 3. Verify Deployment
- Your app will be available at: `https://your-app-name.onrender.com`
- The frontend will communicate with your backend at: `https://projexiq.onrender.com`

## Troubleshooting
- If build fails, check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally with `npm run build` 