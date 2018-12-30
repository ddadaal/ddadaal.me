const path = require("path");

const indexTemplate = path.resolve("src/templates/HomePageTemplate.tsx");
const articleTemplate = path.resolve(`src/templates/ArticlePageTemplate.tsx`);

function createPaginatedHomepages(createPage, articleGroups) {

  const generatePath = (index) => {
    return index === 0 ? "/" : `/${index + 1}`;
  };

  const notIgnoredGroups = [];

  for (const key in articleGroups) {
    const node = articleGroups[key][0];
    if (!node.frontmatter.ignored) {
      notIgnoredGroups.push(node);
    }
  }

  notIgnoredGroups.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  const pageSize = 5;

  const pageCount = Math.ceil(notIgnoredGroups.length / pageSize);

  Array.from({ length: pageCount }).forEach((_, index) => {
    createPage({
      path: generatePath(index),
      component: indexTemplate,
      context: {
        limit: pageSize,
        skip: index * pageSize,
        pageCount,
        index: index + 1,
        items: notIgnoredGroups.slice(index * pageSize, index * pageSize + pageSize),
      },
    })
  });

}


exports.createPages = async ({ actions, graphql }) => {

  console.log("Create pages");

  const { createPage } = actions;

  const result = await graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { draft: { ne: true } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 250, truncate: true)
          html
          headings {
            depth
            value
          }
          id
          frontmatter {
            date
            id
            absolute_path
            title
            ignored
            tags
            hide_heading
            lang
            no_toc
          }
        }
      }
    }
  }`);

  if (result.errors) {
    throw result.errors;
  }



  const articleGroups = {};
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const id = node.frontmatter.id;
    articleGroups[id] = articleGroups[id] || [];
    node.path = `/${node.frontmatter.lang}${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`}`;
    articleGroups[id].push(node);
  });

  createPaginatedHomepages(
    createPage,
    articleGroups
  );

  Object.values(articleGroups).forEach((nodes) => {
    nodes.forEach((node) => {
      const path = node.path;
      createPage({
        path,
        component: articleTemplate,
        context: {
          article: node,
        }
      });
    });
  });
};
