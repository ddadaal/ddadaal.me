import React from "react";
import { graphql } from "gatsby";
import AboutPageLayout, { AboutPageCommonProps } from "@/layouts/about/AboutPageLayout";

export default function OdysseyPage({ data: { allMarkdownRemark: { nodes } } }: AboutPageCommonProps) {
  return (
    <AboutPageLayout allArticles={nodes} articleId={"odyssey"} articleTitle={"一个个人博客的史诗"} />
  );
}

export const query = graphql`
  query OdysseyQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { id: { eq: "odyssey" } } }
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
