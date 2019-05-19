import React from "react";
import { graphql } from "gatsby";
import AboutPageLayout, { AboutPageCommonProps } from "@/layouts/about/AboutPageLayout";

export default function AboutProjectPage({ data: { allMarkdownRemark: { nodes } } }: AboutPageCommonProps) {
  return (
    <AboutPageLayout allArticles={nodes} articleId={"about-project"} articleTitle={"关于网站"} />
  );
}

export const query = graphql`
  query AboutProjectQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { id: { eq: "about-project" } } }
    ) {
      nodes {
        frontmatter {
          id
          lang
          ignored
          date
          absolute_path
          related
          title
        }
        htmlAst
        headings {
          depth
          value
        }
      }
    }
  }
`;
