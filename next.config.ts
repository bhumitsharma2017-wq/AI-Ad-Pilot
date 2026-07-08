import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'adpilot.vercel.app'],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

}

export default nextConfig
