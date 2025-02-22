import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const pwaConfig = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
});

// ✅ Merge reactStrictMode outside of withPWA
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...pwaConfig,
};

export default nextConfig;
