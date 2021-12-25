// for better code readability
/* eslint-disable @typescript-eslint/no-use-before-define */

import path from "path";
import { CreatePagesArgs, SourceNodesArgs } from "gatsby";
import GitHubSlugger from "github-slugger";
import needle from "needle";

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
    last_updated?: string;
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
            last_updated
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

  await createRedirects(redirect, createPage, graphql);


};

function createPaginatedHomepages(
  createPage: CreatePageFn, articleGroups: ArticleGroups) {

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

  notIgnoredGroups.sort((a, b) =>
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

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
        ids: notIgnoredGroups
          .slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
          .map((x) => x.frontmatter.id),
      },
    });
  });

}

function createArticlePages(
  createPage: CreatePageFn, redirect: CreateRedirectFn, articleGroups: ArticleGroups) {
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
      },
    });
  };

  Object.entries(articleGroups).forEach(([key, nodes]) => {
    if (nodes.length === 0) { throw new Error(`${key} has no article!`); }

    // 1. Sort the nodes by lang for consistency in computing
    nodes.sort((a, b) => a.frontmatter.lang.localeCompare(b.frontmatter.lang, "en"));

    // 2. Create index page for the cn version or the first version
    const firstNode = nodes.find((x) => x.frontmatter.lang === "cn") || nodes[0];

    createPageWithPath(firstNode, firstNode.path);

    // 2. Create a redirect from path url with lang to path without lang
    redirect(`${firstNode.path}/${firstNode.frontmatter.lang}`, firstNode.path);

    // 3. Create each page for remaining languages
    //    by appending lang id on the back of path
    nodes.forEach((node) => {
      if (node === firstNode) { return; }
      slugger.reset();

      createPageWithPath(node, `${node.path}/${node.frontmatter.lang}`);
    });
  });
}


// Create slides nodes
export const sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}: SourceNodesArgs) => {

  function createNodeFromSlide(x) {
    createNode({
      ...x,
      id: x.sha,
      internal: {
        type: "Slide",
        contentDigest: createContentDigest(x),
      },
    });
  }

  const slidesUrl= "https://api.github.com/repos/ddadaal/Slides/contents/";

  try {
    const result = await needle("get", slidesUrl, {
      headers: {
        "Content-Type": "application/json",
        // Set the token if ACTIONS_TOKEN environment token exists
        ...process.env.ACTIONS_TOKEN
          ? { "Authorization": `token ${process.env.ACTIONS_TOKEN}` }
          : null,
      },
    }, { json: true });

    result.body.forEach(createNodeFromSlide);

  } catch (e) {
    console.warn("Error occurred when requesting to GitHub to fetch my slides list.");
    console.warn(`An sample Slide node is provided to Gatsby to \
    make the website run without Slides page`);
    console.warn(`Error is ${e}`);

    const dummy = {
      "name": "20161218-2016年微软俱乐部hackathon",
      "path": "20161218-2016年微软俱乐部hackathon",
      "sha": "f4b5ed77d6dd8d493b869b1034403529668ac407",
      "size": 0,
      "url": "https://api.github.com/repos/ddadaal/Slides/contents/20161218-2016%E5%B9%B4%E5%BE%AE%E8%BD%AF%E4%BF%B1%E4%B9%90%E9%83%A8hackathon?ref=master",
      "html_url": "https://github.com/ddadaal/Slides/tree/master/20161218-2016%E5%B9%B4%E5%BE%AE%E8%BD%AF%E4%BF%B1%E4%B9%90%E9%83%A8hackathon",
      "git_url": "https://api.github.com/repos/ddadaal/Slides/git/trees/f4b5ed77d6dd8d493b869b1034403529668ac407",
      "download_url": null,
      "type": "dir",
      "_links": {
        "self": "https://api.github.com/repos/ddadaal/Slides/contents/20161218-2016%E5%B9%B4%E5%BE%AE%E8%BD%AF%E4%BF%B1%E4%B9%90%E9%83%A8hackathon?ref=master",
        "git": "https://api.github.com/repos/ddadaal/Slides/git/trees/f4b5ed77d6dd8d493b869b1034403529668ac407",
        "html": "https://github.com/ddadaal/Slides/tree/master/20161218-2016%E5%B9%B4%E5%BE%AE%E8%BD%AF%E4%BF%B1%E4%B9%90%E9%83%A8hackathon",
      },
    };
    createNodeFromSlide(dummy);
  }
};

interface RedirectsQueryResult {
  allRedirectsJson: {
    nodes: { id: string; to: string }[];
  }
}

const CLIENT_REDIRECT = true;
const redirectsTemplate = path.resolve("src/templates/RedirectPageTemplate.tsx");
const redirectPrefix = "/r/";

async function createRedirects(
  redirect: CreateRedirectFn,
  createPage: CreatePageFn,
  graphql: CreatePagesArgs["graphql"],
) {
  const result = await graphql<RedirectsQueryResult>(`{
    allRedirectsJson {
      nodes {
        id
        to
      }
    }
  }`);

  if (result.errors || !result.data) {
    throw result.errors;
  }

  result.data.allRedirectsJson.nodes.forEach(({ id, to }) => {

    const path = redirectPrefix + id;

    if (CLIENT_REDIRECT) {
      createPage({ path: path, component: redirectsTemplate, context: { id, to } });
    } else {
      redirect(path, to);
    }
  });

}
