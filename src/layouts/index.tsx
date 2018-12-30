import * as React from "react";
import Helmet from "react-helmet";

import "prismjs/themes/prism-okaidia.css";
import "@/styles/index.scss";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "react-scroll-up";
import icon512 from "~/assets/icon.png";

import styled from "styled-components";

import { StaticQuery, graphql } from "gatsby";
import { FaArrowUp } from "react-icons/fa";

import { IconContext } from "react-icons";
import StoreProvider from "@/stores/StoreProvider";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore } from "@/stores/LocationStore";
import { ArticleStore, createArticleGroups } from "@/stores/ArticleStore";
import { ArticleNode } from "@/models/ArticleNode";

interface SiteMetaData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
    },
  };
  allMarkdownRemark: {
    edges: { node: ArticleNode; }[]
  }
}

interface Props {
  location: Location;
  children: React.ReactNode;
}

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { draft: { ne: true } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 250, truncate: true)
          html
          headings {
            depth
            value
          }
          id
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

class RootLayout extends React.Component<Props & SiteMetaData, {}> {

  i18nStore = new I18nStore();

  locationStore = new LocationStore(this.props.location);

  articleStore = new ArticleStore(createArticleGroups(this.props.allMarkdownRemark));

  componentDidUpdate() {
    this.locationStore.updateLocation(this.props.location);
  }

  render() {

    const { children, site } = this.props;

    return (
      <IconContext.Provider value={{ className: "icons" }}>
        <StoreProvider stores={[this.i18nStore, this.locationStore, this.articleStore]} >
          <LayoutRoot>
            <Helmet
              title={site.siteMetadata.title}
              meta={[
                { name: "description", content: site.siteMetadata.description },
                { name: "keywords", content: "gatsbyjs, gatsby, javascript, sample, something" },
              ]}
              link={[
                { rel: "icon", type: "image/png", href: icon512 },
                { rel: "shortcut icon", type: "image/png", href: icon512 },
              ]}
            />
            <Header title={site.siteMetadata.title} />
            <LayoutMain>{children}</LayoutMain>
            <ScrollToTop showUnder={160}>
              <h3><FaArrowUp /></h3>
            </ScrollToTop>
            <Footer />
          </LayoutRoot>
        </StoreProvider>
      </IconContext.Provider>
    );
  }
}

export default function (props) {
  return (
    <StaticQuery query={query}>
      {(data: SiteMetaData) => <RootLayout {...data} {...props} />}
    </StaticQuery>
  )
}
