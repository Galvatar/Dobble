import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = {
  nextConfig,
  async headers() {
    return [
      {
        source: '/symbols/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Never revalidate over network
          },
        ],
      },
    ];
  },
};
