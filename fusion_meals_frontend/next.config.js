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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com';
      console.log(`Using API URL: ${apiUrl}`);
      
      // Production rewrites - use deployed backend URL
      return [
        {
          source: '/api/recipes/:path*',
          destination: `${apiUrl}/recipes/:path*`,
        },
        {
          source: '/api/meal-plans/:path*',
          destination: `${apiUrl}/meal-plans/:path*`,
        },
        {
          source: '/api/grocery/:path*',
          destination: `${apiUrl}/grocery/:path*`,
        },
        {
          source: '/api/email/:path*',
          destination: `${apiUrl}/email/:path*`,
        },
        {
          source: '/api/ingredient-substitution/:path*',
          destination: `${apiUrl}/ingredient-substitution/:path*`,
        },
        {
          source: '/api/recipe-scaling/:path*',
          destination: `${apiUrl}/recipe-scaling/:path*`,
        },
        {
          source: '/api/recipe-analysis/:path*',
          destination: `${apiUrl}/recipe-analysis/:path*`,
        },
        {
          source: '/api/recipe-sharing/:path*',
          destination: `${apiUrl}/recipe-sharing/:path*`,
        },
        {
          source: '/api/ai-chef/:path*',
          destination: `${apiUrl}/ai-chef/:path*`,
        },
        {
          source: '/api/global-cuisine/:path*',
          destination: `${apiUrl}/global-cuisine/:path*`,
        },
        {
          source: '/api/meal-prep/:path*',
          destination: `${apiUrl}/meal-prep/:path*`,
        }
      ]
    }
  },
}

module.exports = nextConfig 