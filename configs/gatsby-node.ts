// for better code readability
/* eslint-disable @typescript-eslint/no-use-before-define */

import path from "path";
import { CreatePagesArgs, SourceNodesArgs } from "gatsby";
import GitHubSlugger from "github-slugger";
import fetch from "node-fetch";

const indexTemplate = path.resolve("src/templates/ArticleListPageTemplate.tsx");
const articleTemplate = path.resolve("src/templates/ArticlePageTemplate.tsx");

type CreatePageFn = CreatePagesArgs["actions"]["createPage"];

type CreateRedirectFn = (from: string, to: string) => void;

type ArticleGroups = { [articleId: string]: ArticleNode[] };

interface ArticleNode {
  frontmatter: {
    id: string;
    lang: string;
    ignored_in_list?: boolean;
    date: string;
    no_create_page?: boolean;
    absolute_path?: string;
    related?: string[];
  };
  path: string;
  headings: {
    depth: number;
    value: string;
  }[];
  htmlAst: string;
}

interface ArticlesQueryResult {
  allMarkdownRemark: {
    edges: {
      node: ArticleNode;
    }[];
  };
}

export const createPages = async ({ actions, graphql }: CreatePagesArgs) => {

  const { createPage, createRedirect } = actions;

  const result = await graphql<ArticlesQueryResult>(`{
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

  if (result.errors || !result.data) {
    throw result.errors;
  }

  // Group articles with lang
  const articleGroups = {} as ArticleGroups;
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const { id, absolute_path } = node.frontmatter;
    articleGroups[id] = articleGroups[id] || [];

    // calculate lang-neutral url
    node.path = absolute_path || `/articles/${id}`;
    articleGroups[id].push(node);
  });

  function redirect(from: string, to: string) {
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

function createPaginatedHomepages(createPage: CreatePageFn, articleGroups: ArticleGroups) {

  const generatePath = (index: number) => {
    return `/articles${index === 0 ? "" : `/${index + 1}`}`;
  };

  const notIgnoredGroups = [] as ArticleNode[];

  for (const key in articleGroups) {
    const node = articleGroups[key][0];
    if (!node.frontmatter.no_create_page && !node.frontmatter.ignored_in_list) {
      notIgnoredGroups.push(node);
    }
  }

  notIgnoredGroups.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

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

function createArticlePages(createPage: CreatePageFn, redirect: CreateRedirectFn, articleGroups: ArticleGroups) {
  const slugger = new GitHubSlugger();

  const createPageWithPath = (node: ArticleNode, path: string) => {
    createPage({
      path,
      component: articleTemplate,
      context: {
        id: node.frontmatter.id,
        lang: node.frontmatter.lang,
        htmlAst: node.htmlAst,
        headings: node.headings.map((x) => ({
          ...x,
          slug: slugger.slug(x.value, false),
        })),
      }
    });
  }

  Object.entries(articleGroups).forEach(([key, nodes]) => {
    if (nodes.length === 0) { throw new Error(`${key} has no article!`); }

    // 1. Sort the nodes by lang for consistency in computing
    nodes.sort((a, b) => a.frontmatter.lang.localeCompare(b.frontmatter.lang, "en"));

    // 2. Create index page for the cn version or the first version
    const firstNode = nodes.find((x) => x.frontmatter.lang === "cn") || nodes[0];

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


// Create slides nodes
export const sourceNodes = async ({
  actions: { createNode },
  createContentDigest
}: SourceNodesArgs) => {
  const slidesUrl= `https://api.github.com/repos/ddadaal/Slides/contents/`;
  const result = await (await fetch(slidesUrl, {
    headers: {
      'Content-Type': 'application/json',
      // Set the token if ACTIONS_TOKEN environment token exists
      ...process.env.ACTIONS_TOKEN ? {
        'Authorization': `token ${process.env.ACTIONS_TOKEN}`
      } : null
    },
  })).json();

  result.forEach((x) => {
    createNode({
      ...x,
      id: x.sha,
      internal: {
        type: "Slide",
        contentDigest: createContentDigest(x),
      }
    });
  });
}
