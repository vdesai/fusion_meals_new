# Fusion Meals Deployment Guide

## Vercel Deployment Instructions

### 1. Push the Latest Code Changes

Before deploying, make sure to push the latest code changes to your GitHub repository:

```bash
git add .
git commit -m "Fix NextAuth configuration for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. **Import Repository**: Click on "Add New" → "Project" and select your Fusion Meals repository
3. **Configure Project**:
   - **Framework Preset**: Make sure "Next.js" is selected
   - **Root Directory**: If your frontend is in a subfolder (e.g., `fusion_meals_frontend`), set this path
   - **Build Command**: Use the default (`next build`)
   - **Output Directory**: Use the default (`.next`)

### 3. Environment Variables

Add the following environment variables in the Vercel dashboard:

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=https://your-backend-url.com
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PRICE_ID=your-stripe-price-id
DATABASE_URL=your-database-url
```

Replace each value with your actual configuration.

### 4. Deploy

Click "Deploy" to start the deployment process. Vercel will build and deploy your application.

### 5. Check Logs

If you encounter any issues, check the build and deployment logs in the Vercel dashboard for specific errors.

## Backend Deployment (Render)

Follow these steps to deploy your backend on Render:

1. **Login to Render**: Go to [render.com](https://render.com) and sign in
2. **Create Web Service**: Click on "New" → "Web Service"
3. **Connect Repository**: Connect your GitHub repository
4. **Configure Service**:
   - **Name**: fusion-meals-backend
   - **Root Directory**: `fusion_meals_backend` (if in a subfolder)
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Environment Variables

Add the necessary environment variables in the Render dashboard:

```
DATABASE_URL=your-production-database-url
SECRET_KEY=your-backend-secret-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## Final Steps

1. **Update CORS Settings**: Ensure the backend allows requests from your Vercel frontend domain
2. **Test the Deployment**: Verify that all API calls work correctly between frontend and backend
3. **Set Up Custom Domain**: Optionally configure custom domains for your frontend and backend

## Troubleshooting

If you encounter issues with NextAuth, check:
- That all environment variables are correctly set on Vercel
- That the `NEXTAUTH_URL` matches your Vercel deployment URL
- That your OAuth providers are configured to allow your Vercel domain

For other deployment issues, refer to the Vercel and Render documentation or consult their support resources. 