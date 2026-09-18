import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    rules: {
      "*.md": { loaders: ["./tools/raw-content-loader.cjs"], as: "*.js" },
      "*.mdx": { loaders: ["./tools/raw-content-loader.cjs"], as: "*.js" },
      "*.summary.json": { loaders: ["./tools/raw-content-loader.cjs"], as: "*.js" },
    },
  },
  // Enable Next.js 16 Cache Components. Static article content can be served
  // from the persistent cache while the small view-count API remains dynamic.
  cacheComponents: true,
  cacheLife: {
    // Content changes are deployed with the image, so cache article metadata
    // for a week and retain it for a year between requests.
    articles: {
      stale: 86400,
      revalidate: 604800,
      expire: 31536000,
    },
  },

  serverExternalPackages: ["@node-rs/jieba", "@node-rs/jieba/dict"],
  outputFileTracingIncludes: {
    "/*": ["./contents/**/*"],
  },
};

export default nextConfig;
