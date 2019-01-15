import * as React from "react";
import "@/styles/index.scss";

import { StaticQuery, graphql } from "gatsby";
import { SiteMetadata } from "@/models/SiteMetadata";
import RootLayout from "./RootLayout";
import dayjs from "dayjs";
import { createArticleGroups } from "@/stores/ArticleStore";
import { ArticleNode } from "@/models/ArticleNode";

interface InitialData {
  site: { siteMetadata: SiteMetadata };
  allMarkdownRemark: { edges: { node: ArticleNode }[] };
}

interface Props {
  location: Location;
  children: React.ReactNode;
}


const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
        lastUpdated
        siteUrl
      }
    }
    allMarkdownRemark {
      edges {
        node {
          excerpt(pruneLength: 250, truncate: true)
          timeToRead
          wordCount {
            words
          }
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
  }
`;

export default function (props: Props) {
  return (
    <StaticQuery query={query}>
      {(data: InitialData) => {

        const articleGroups = createArticleGroups(data.allMarkdownRemark.edges.map(({ node }) => node));

        const statistics = {
          lastUpdated: dayjs(data.site.siteMetadata.lastUpdated).format("YYYY/MM/DD HH:mm:ss ZZ"),
          totalArticleCount: Object.keys(articleGroups).length,
        };

        return (
          <RootLayout
            location={props.location}
            siteMetadata={data.site.siteMetadata}
            statistics={statistics}
            articleGroups={articleGroups}
          >
          {props.children}
          </RootLayout>
        );
      }}
    </StaticQuery>
  )
}
