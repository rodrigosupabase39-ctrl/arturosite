import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desactivar optimización de imágenes para evitar error 402 (PAYMENT_REQUIRED) en Vercel
    // cuando se supera el límite gratuito de optimización de imágenes
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
