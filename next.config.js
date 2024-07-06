/* eslint-env node */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push("@node-rs/jieba");

    return config;
  },
};

module.exports = nextConfig;
