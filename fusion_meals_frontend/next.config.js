/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      // Development rewrites - use local backend
      return [
        {
          source: '/api/recipes/:path*',
          destination: 'http://127.0.0.1:8001/recipes/:path*',
        },
        {
          source: '/api/meal-plans/:path*',
          destination: 'http://127.0.0.1:8001/meal-plans/:path*',
        },
        {
          source: '/api/grocery/:path*',
          destination: 'http://127.0.0.1:8001/grocery/:path*',
        },
        {
          source: '/api/email/:path*',
          destination: 'http://127.0.0.1:8001/email/:path*',
        },
        {
          source: '/api/ingredient-substitution/:path*',
          destination: 'http://127.0.0.1:8001/ingredient-substitution/:path*',
        },
        {
          source: '/api/recipe-scaling/:path*',
          destination: 'http://127.0.0.1:8001/recipe-scaling/:path*',
        },
        {
          source: '/api/recipe-analysis/:path*',
          destination: 'http://127.0.0.1:8001/recipe-analysis/:path*',
        },
        {
          source: '/api/recipe-sharing/:path*',
          destination: 'http://127.0.0.1:8001/recipe-sharing/:path*',
        }
      ]
    } else {
      // Get the backend URL from environment variables
      const backendUrl = process.env.BACKEND_URL || 'https://fusion-meals-backend.onrender.com';
      console.log(`Using backend URL: ${backendUrl}`);
      
      // Production rewrites - use deployed backend URL
      return [
        {
          source: '/api/recipes/:path*',
          destination: `${backendUrl}/recipes/:path*`,
        },
        {
          source: '/api/meal-plans/:path*',
          destination: `${backendUrl}/meal-plans/:path*`,
        },
        {
          source: '/api/grocery/:path*',
          destination: `${backendUrl}/grocery/:path*`,
        },
        {
          source: '/api/email/:path*',
          destination: `${backendUrl}/email/:path*`,
        },
        {
          source: '/api/ingredient-substitution/:path*',
          destination: `${backendUrl}/ingredient-substitution/:path*`,
        },
        {
          source: '/api/recipe-scaling/:path*',
          destination: `${backendUrl}/recipe-scaling/:path*`,
        },
        {
          source: '/api/recipe-analysis/:path*',
          destination: `${backendUrl}/recipe-analysis/:path*`,
        },
        {
          source: '/api/recipe-sharing/:path*',
          destination: `${backendUrl}/recipe-sharing/:path*`,
        },
        {
          source: '/api/ai-chef/:path*',
          destination: `${backendUrl}/ai-chef/:path*`,
        },
        {
          source: '/api/global-cuisine/:path*',
          destination: `${backendUrl}/global-cuisine/:path*`,
        },
        {
          source: '/api/meal-prep/:path*',
          destination: `${backendUrl}/meal-prep/:path*`,
        }
      ]
    }
  },
}

module.exports = nextConfig 