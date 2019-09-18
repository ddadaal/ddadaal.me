const path = require("path");

const indexTemplate = path.resolve("src/templates/ArticleListPageTemplate.tsx");
const articleTemplate = path.resolve(`src/templates/ArticlePageTemplate.tsx`);

const GitHubSlugger = require("github-slugger");

const dayjs = require("dayjs");


exports.createPages = async ({ actions, graphql }) => {

  const { createPage, createRedirect } = actions;

  const result = await graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { no_create_page: { ne: true }}}
    ) {
      edges {
        node {
          frontmatter {
            id
            lang
            ignored_in_list
            date
            no_create_page
            absolute_path
            related
          }
          htmlAst
          headings {
            depth
            value
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
    node.path = node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`;
    articleGroups[id].push(node);
  });

  function redirect(from, to) {
    createRedirect({
      fromPath: from,
      toPath: to,
      isPermanent: true,
      redirectInBrowser: true,
    });

    createRedirect({
      fromPath: from + "/",
      toPath: to,
      isPermanent: true,
      redirectInBrowser: true,
    });
  }
  // create redirects

  redirect("/about", "/about/odyssey");

  createPaginatedHomepages(
    createPage,
    articleGroups,
  );

  createArticlePages(
    createPage,
    redirect,
    articleGroups,
  );


};

function createPaginatedHomepages(createPage, articleGroups) {

  const generatePath = (index) => {
    return `/articles${index === 0 ? "" : `/${index + 1}`}`;
  };

  const notIgnoredGroups = [];

  for (const key in articleGroups) {
    const node = articleGroups[key][0];
    if (!node.frontmatter.no_create_page && !node.frontmatter.ignored_in_list) {
      notIgnoredGroups.push(node);
    }
  }

  notIgnoredGroups.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  const pageSize = 5;

  const pageCount = Math.ceil(notIgnoredGroups.length / pageSize);

  Array.from({ length: pageCount }).forEach((_, pageIndex) => {
    createPage({
      path: generatePath(pageIndex),
      component: indexTemplate,
      context: {
        limit: pageSize,
        skip: pageIndex * pageSize,
        pageCount,
        pageIndex: pageIndex,
        ids: notIgnoredGroups.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize).map((x) => x.frontmatter.id),
      },
    })
  });

}

function createArticlePages(createPage, redirect, articleGroups) {
  const slugger = new GitHubSlugger();

  const createPageWithPath = (node, path) => {
    createPage({
      path,
      component: articleTemplate,
      context: {
        id: node.frontmatter.id,
        lang: node.frontmatter.lang,
        htmlAst: node.htmlAst,
        headings: node.headings.map((x) => ({
          ...x,
          slug: slugger.slug(x.value),
        })),
      }
    });
  }

  Object.entries(articleGroups).forEach(([key, nodes]) => {
    if (nodes.length === 0) { throw new Error(`${key} has no article!`); }

    // 1. Sort the nodes by lang for consistency in computing
    nodes.sort((a, b) => a.frontmatter.lang.localeCompare(b.frontmatter.lang, "en"));

    // 2. Create index page for the cn version or the first version
    const firstNode = nodes.find((x) => x.lang === "cn") || nodes[0];

    createPageWithPath(firstNode, firstNode.path);

    // 2. Create a redirect from path url with lang to path without lang
    redirect(`${firstNode.path}/${firstNode.frontmatter.lang}`, firstNode.path);

    // 3. Create each page for remaining languages by appending lang id on the back of path
    nodes.forEach((node) => {
      if (node === firstNode) { return; }
      slugger.reset();

      createPageWithPath(node, `${node.path}/${node.frontmatter.lang}`)
    });
  });
}

