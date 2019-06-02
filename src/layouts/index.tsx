import React, { useRef, useState } from "react";

import { graphql, useStaticQuery } from "gatsby";
import { SiteMetadata } from "@/models/SiteMetadata";
import RootLayout from "./RootLayout";
import dayjs from "dayjs";
import { ArticleNode } from "@/models/ArticleNode";
import useConstant from "@/utils/useConstant";

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
    allMarkdownRemark(
      filter: { frontmatter: { no_create_page: { ne: true }}}
    ) {
      nodes {
        excerpt(pruneLength: 250, truncate: true)
        wordCount {
          words
        }
        frontmatter {
          no_create_page
          date
          id
          absolute_path
          title
          ignored_in_list
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

export default function IndexLayout(props: Props) {

  const data: InitialData = useStaticQuery(query);

  // create tag map
  const tagMap = new Map() as TagMap;

  data.allTagsJson.nodes.forEach(({ tag, ...variations }) => {
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
      lastUpdated={dayjs(data.site.siteMetadata.lastUpdated).format("YYYY/MM/DD HH:mm:ss ZZ")}
      articles={data.allMarkdownRemark.nodes}
      tagMap={tagMap}
    >
      {props.children}
    </RootLayout>
  );

}
