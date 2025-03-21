/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
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
  },
}

module.exports = nextConfig 