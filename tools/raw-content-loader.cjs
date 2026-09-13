// Preserve Markdown/frontmatter for the existing parser while making each
// content file a module tracked by Turbopack's Fast Refresh dependency graph.
module.exports = function rawContentLoader(source) {
  return `export default ${JSON.stringify(source)};`;
};
