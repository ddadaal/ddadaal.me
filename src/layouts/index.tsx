import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { SiteMetadata } from "@/models/SiteMetadata";
import RootLayout from "./RootLayout";
import { ArticleNode } from "@/models/ArticleNode";
import { Tag } from "@/models/Tag";

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
        name
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
        timeToRead
        wordCountChinese
        frontmatter {
          no_create_page
          date
          last_updated
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

const IndexLayout: React.FC<Props> = (props) => {

  const data: InitialData = useStaticQuery(query);

  return (
    <RootLayout
      location={props.location}
      siteMetadata={data.site.siteMetadata}
      articles={data.allMarkdownRemark.nodes}
      tags={data.allTagsJson.nodes}
    >
      {props.children}
    </RootLayout>
  );

};

export default IndexLayout;
