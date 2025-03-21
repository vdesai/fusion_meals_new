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
      // Production rewrites - use deployed backend URL
      return [
        {
          source: '/api/recipes/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/recipes/:path*`,
        },
        {
          source: '/api/meal-plans/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/meal-plans/:path*`,
        },
        {
          source: '/api/grocery/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/grocery/:path*`,
        },
        {
          source: '/api/email/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/email/:path*`,
        },
        {
          source: '/api/ingredient-substitution/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/ingredient-substitution/:path*`,
        },
        {
          source: '/api/recipe-scaling/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/recipe-scaling/:path*`,
        },
        {
          source: '/api/recipe-analysis/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/recipe-analysis/:path*`,
        },
        {
          source: '/api/recipe-sharing/:path*',
          destination: `${process.env.BACKEND_URL || 'https://your-backend-url.com'}/recipe-sharing/:path*`,
        }
      ]
    }
  },
}

module.exports = nextConfig 