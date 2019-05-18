const nested = require('postcss-nested');
const atImport = require("postcss-import");

module.exports = () => ({
  plugins: [
    nested(),
    atImport(),
  ],
})
