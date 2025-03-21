/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fusion-meals-new.onrender.com',
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure we're not limiting the image domains
  images: {
    domains: ['placehold.co', 'images.unsplash.com', 'via.placeholder.com', 'fusion-meals-new.onrender.com'],
  },
  // Set output directory
  distDir: 'dist',
  // Keep rewrites as they were
  async rewrites() {
    // We're using our own API routes now, so no need for external rewrites
    return []
  },
}

module.exports = nextConfig 