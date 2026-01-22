/* eslint-env node */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  serverExternalPackages: ["@node-rs/jieba", "@node-rs/jieba/dict"],
};

module.exports = nextConfig;
