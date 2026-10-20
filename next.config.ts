import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js 16'nın deneysel önbellekleme özelliklerini kapat
  cacheComponents: false,
  partialPrefetching: false,

  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'http', hostname: 'backend', port: '8000' },
      { protocol: 'https', hostname: 'asosial-backend.onrender.com' },
    ],
  },
};

export default nextConfig;