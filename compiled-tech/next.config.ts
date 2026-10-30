import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["192.168.100.171"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    // Legacy/typo URL insurance. Nothing is currently broken, but these are the
    // paths people type or old links used; 301 to the real page instead of a 404.
    // ponytail: static list — move to a DB table if it ever grows past ~20.
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:slug", destination: "/work/:slug", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/blog-posts", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
      { source: "/services/web", destination: "/services/build", permanent: true },
      { source: "/services/mobile", destination: "/services/build", permanent: true },
      { source: "/services/ai", destination: "/services/ai-ml", permanent: true },
      { source: "/prices", destination: "/pricing", permanent: true },
      { source: "/quote", destination: "/contact", permanent: true },
      { source: "/get-a-quote", destination: "/contact", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;