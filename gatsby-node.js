const path = require("path");

const indexTemplate = path.resolve("src/templates/HomePageTemplate.tsx");
const articleTemplate = path.resolve(`src/templates/ArticlePageTemplate.tsx`);



function createPaginatedHomepages(totalCount, createPage) {

  const generatePath = (index) => {
    return index === 0 ? "/" : `/${index + 1}`;
  };


  const pageSize = 5;

  const pageCount = Math.ceil(totalCount / pageSize);

  Array.from({ length: pageCount }).forEach((_, index) => {
    createPage({
      path: generatePath(index),
      component: indexTemplate,
      context: {
        limit: pageSize,
        skip: index * pageSize,
        pageCount: pageCount,
        index: index + 1
      },
    })
  });

}


exports.createPages = async ({ actions, graphql }) => {

  const { createPage } = actions;

  const result = await graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { draft: { ne: true } }}
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
            hide_heading
          }
        }
      }
    }
  }`);

  if (result.errors) {
    throw result.errors;
  }

  // createPaginatedPages({
  //   edges: result.data.allMarkdownRemark.edges.filter((x) => !x.node.frontmatter.ignored),
  //   createPage: createPage,
  //   pageTemplate: "src/pages/HomePageTemplate.tsx",
  //   pageLength: 5, // This is optional and defaults to 10 if not used
  //   pathPrefix: "", // This is optional and defaults to an empty string if not used
  //   context: { ...buildTime } // This is optional and defaults to an empty object if not used
  // });


  createPaginatedHomepages(
    result.data.allMarkdownRemark.edges.filter((x) => !x.node.frontmatter.ignored).length,
    createPage
  );



  result.data.allMarkdownRemark.edges
    .forEach(({ node }) => {
      const path = node.frontmatter.absolute_path || `/articles/${node.frontmatter.id_name}`;
      createPage({
        path,
        component: articleTemplate,
        context: {
          id_name: node.frontmatter.id_name,
        } // additional data can be passed via context
      });
    });
};
