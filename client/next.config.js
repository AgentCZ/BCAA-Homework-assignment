/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy /api/* -> backend (Express) on port 8888.
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
