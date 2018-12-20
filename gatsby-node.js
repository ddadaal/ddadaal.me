const path = require("path");

const indexTemplate = path.resolve("src/templates/HomePageTemplate.tsx");
const articleTemplate = path.resolve(`src/templates/ArticlePageTemplate.tsx`);

function createPaginatedHomepages(totalCount, createPage, articleGroups) {

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
        index: index + 1,
        articleGroups
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
            lang
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
    const id = node.frontmatter.id_name;
    articleGroups[id] = articleGroups[id] || [];
    node.path = `/${node.frontmatter.lang}${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id_name}`}`;
    articleGroups[id].push(node);
  });

  createPaginatedHomepages(
    result.data.allMarkdownRemark.edges.filter((x) => !x.node.frontmatter.ignored && x.node.frontmatter.lang === "cn").length,
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
          id_name: node.frontmatter.id_name,
          lang: node.frontmatter.lang,
          articleGroups,
        }
      });
    });
  });



  // result.data.allMarkdownRemark.edges
  //   .forEach(({ node }) => {
  //     const path = `${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id_name}`}/${node.frontmatter.lang}`;
  //     createPage({
  //       path,
  //       component: articleTemplate,
  //       context: {
  //         id_name: node.frontmatter.id_name,
  //         lang: node.frontmatter.lang,
  //       } // additional data can be passed via context
  //     });
  //   });
};
