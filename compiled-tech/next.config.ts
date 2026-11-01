import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The image optimizer needs sharp's native libvips .so at runtime. Standalone
  // tracing copies the JS but leaves libvips-cpp.so nested under
  // node_modules/@img/sharp-linux-x64/node_modules/, where the loader never
  // finds it — so every /_next/image request silently falls back to serving the
  // full-size original (an 80KB 1267px photo for a 384px slot). This is the
  // include pattern Next's own standalone docs recommend.
  outputFileTracingIncludes: {
    "/*": ["node_modules/sharp/**/*", "node_modules/@img/**/*"],
  },
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
        // Hero video: long cache + correct MIME. Hostinger's CDN was serving
        // hero.webm as text/plain with no cache header, so repeat visitors
        // re-downloaded 1.4MB on every visit.
        source: "/hero/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
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