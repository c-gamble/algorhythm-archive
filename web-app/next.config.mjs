/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "s3.amazonaws.com",
            "upload.wikimedia.org",
            "algorhythm-public-assets.s3.amazonaws.com",
            "localhost",
            "web-app-one-rosy.vercel.app",
            "i.scdn.co",
            "image-cdn-ak.spotifycdn.com",
            "i.pinimg.com",
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
            },
            {
                protocol: "https",
                hostname: "algorhythm-public-assets.s3.amazonaws.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "web-app-one-rosy.vercel.app",
            },
            {
                protocol: "https",
                hostname: "*.ngrok-free.app",
            },
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
