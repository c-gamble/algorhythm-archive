/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'algorhythm-public-assets.s3.amazonaws.com'
        },
      ],
    },
  }
