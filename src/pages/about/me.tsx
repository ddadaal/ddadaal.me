import React from "react";
import { graphql } from "gatsby";
import AboutPageLayout, { AboutPageCommonProps } from "@/layouts/about/AboutPageLayout";

export default function AboutMePage({ data: { allMarkdownRemark: { nodes } } }: AboutPageCommonProps) {
  return (
    <AboutPageLayout allArticles={nodes} articleId={"about-me"} articleTitle={"关于我"} />
  );
}

export const query = graphql`
  query AboutMeQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { id: { eq: "about-me" } } }
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
