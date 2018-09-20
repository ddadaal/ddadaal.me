const path = require('path');
const createPaginatedPages = require("gatsby-paginate");

exports.createPages = ({ actions, graphql }) => {

  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/page.tsx`);

  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          frontmatter {
            date
            id_name
            absolute_path
            title
            ignored
            tags
          }
        }
      }
    }
  }`)
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }
      createPaginatedPages({
        edges: result.data.allMarkdownRemark.edges.filter(({node}) => !node.frontmatter.ignored),
        createPage: createPage,
        pageTemplate: "src/templates/index.tsx",
        pageLength: 5, // This is optional and defaults to 10 if not used
        pathPrefix: "", // This is optional and defaults to an empty string if not used
        context: {} // This is optional and defaults to an empty object if not used
      });
      result.data.allMarkdownRemark.edges
        .forEach(({ node }, index) => {
          const path = node.frontmatter.absolute_path
            || `/articles/${node.frontmatter.id_name || index}`;
          createPage({
            path,
            component: blogPostTemplate,
            context: {
              id_name: node.frontmatter.id_name
            } // additional data can be passed via context
          });
        });
    });
}
