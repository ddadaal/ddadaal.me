/* eslint-env node */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  serverExternalPackages: ["@node-rs/jieba", "@node-rs/jieba/dict", "mssql"],
  outputFileTracingIncludes: {
    "/*": ["./contents/**/*"],
  },
};

module.exports = nextConfig;
