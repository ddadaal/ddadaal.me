const base = require("@ddadaal/eslint-config");
const react = require("@ddadaal/eslint-config/react");

module.exports = [
  ...base,
  ...react,
  {
    ignores: [".next"]
  }
];
