/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    // View totals are intentionally eventually consistent. The POST response
    // contains the exact new total; list pages can use a cached snapshot.
    views: {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
  },

  serverExternalPackages: ["@node-rs/jieba", "@node-rs/jieba/dict", "mssql"],
  outputFileTracingIncludes: {
    "/*": ["./contents/**/*"],
  },
};

module.exports = nextConfig;
