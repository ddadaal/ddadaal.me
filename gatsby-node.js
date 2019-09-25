require("ts-node").register();

const { createPages } = require("./configs/gatsby-node");

exports.createPages = createPages;
