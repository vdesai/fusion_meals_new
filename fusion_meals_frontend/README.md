# Fusion Meals Frontend

This is the frontend for the Fusion Meals application, built with Next.js.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

For production deployment, set the `BACKEND_URL` environment variable in your Vercel project settings to point to your deployed backend API.

## Deploy on Vercel

Follow these steps to deploy the frontend on Vercel:

1. Push your code to a GitHub repository

2. Visit the [Vercel Dashboard](https://vercel.com)

3. Create a new project and import your repository

4. Configure the following settings:
   - Framework Preset: Next.js
   - Root Directory: fusion_meals_frontend
   - Environment Variables: 
     - `BACKEND_URL`: Your deployed backend URL (e.g., https://fusion-meals-api.onrender.com)

5. Click "Deploy"

### Troubleshooting Vercel Deployment

If you encounter build errors:

1. Make sure the `BACKEND_URL` environment variable is correctly set in Vercel

2. The build automatically ignores ESLint and TypeScript errors, so those shouldn't be an issue

3. If you see Next.js runtime errors:
   - Check for any client components using server-only features
   - Ensure all components using `useSearchParams` are wrapped in Suspense boundaries

## Backend Deployment

The backend can be deployed separately on platforms like Render or Railway. Make sure to:

1. Set the correct CORS settings in the backend to allow requests from your Vercel domain

2. Update the `BACKEND_URL` in Vercel to point to your deployed backend

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Vercel Documentation](https://vercel.com/docs) - explore Vercel features.
