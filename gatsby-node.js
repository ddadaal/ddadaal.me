require("ts-node").register();

const { createPages, sourceNodes } = require("./configs/gatsby-node");

exports.createPages = createPages;
exports.sourceNodes = sourceNodes;
