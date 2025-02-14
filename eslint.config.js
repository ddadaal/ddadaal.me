const base = require("@ddadaal/eslint-config");
const react = require("@ddadaal/eslint-config/react");

module.exports = [
  ...base,
  ...react,
  {
    ignores: [".next", "node_modules", "out"]
  },
  {
    files: ["ai/**/*.{js,jsx,ts,tsx}", "posts/**/*.{js,jsx,ts,tsx}"]
  }
];
