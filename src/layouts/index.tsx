import React, { useRef } from "react";
import "@/styles/index.scss";

import { StaticQuery, graphql } from "gatsby";
import { SiteMetadata } from "@/models/SiteMetadata";
import RootLayout from "./RootLayout";
import dayjs from "dayjs";
import { createArticleGroups } from "@/stores/MetadataStore";
import { ArticleNode } from "@/models/ArticleNode";
import { ArticleGroups } from "@/models/ArticleGroups";

interface InitialData {
  site: { siteMetadata: SiteMetadata };
  allTagsJson: { nodes: Tag[] };
  allMarkdownRemark: { nodes: ArticleNode[] };
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
    allTagsJson {
      nodes {
        tag
        cn
        en
      }
    }
    allMarkdownRemark {
      nodes {
        excerpt(pruneLength: 250, truncate: true)
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
          related
        }
      }
    }
  }
`;

export default function(props: Props) {

  const articleGroupsMemo = useRef<null | ArticleGroups>(null);

  return (
    <StaticQuery query={query}>
      {(data: InitialData) => {

        if (!articleGroupsMemo.current) {
          articleGroupsMemo.current = createArticleGroups(data.allMarkdownRemark.nodes);
        }

        const articleGroups = articleGroupsMemo.current;

        const statistics = {
          lastUpdated: dayjs(data.site.siteMetadata.lastUpdated).format("YYYY/MM/DD HH:mm:ss ZZ"),
          totalArticleCount: Object.keys(articleGroups).length,
        };

        // create tag map
        const tagMap = new Map() as TagMap;

        data.allTagsJson.nodes.forEach(({ tag, ...variations}) => {
          tagMap.set(tag, { count: 0, variations });
        });

        // for each tags
        data.allMarkdownRemark.nodes.forEach((node) => {
            if (node.frontmatter.tags) {
              node.frontmatter.tags.forEach((tag) => {
                if (!tagMap.has(tag)) {
                  tagMap.set(tag, { count: 1, variations: tag });
                } else {
                  tagMap.get(tag)!!.count++;
                }
              });
            }
        });

        return (
          <RootLayout
            location={props.location}
            siteMetadata={data.site.siteMetadata}
            statistics={statistics}
            articleGroups={articleGroups}
            tagMap={tagMap}
          >
          {props.children}
          </RootLayout>
        );
      }}
    </StaticQuery>
  );
}
