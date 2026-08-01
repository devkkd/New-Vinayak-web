/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-f4cf2823641a436fb90c4284c9a3a846.r2.dev",
        pathname: "/**",
      },
    ],
    // Skip Next.js image proxy — R2 CDN serves images directly.
    // Avoids the 7s upstream timeout on every /_next/image request.
    unoptimized: true,
  },
};

export default nextConfig;
