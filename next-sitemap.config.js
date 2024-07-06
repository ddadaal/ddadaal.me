/* eslint-env node */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://ddadaal.me",
  generateRobotsTxt: true,
  outDir: "./out",
};
