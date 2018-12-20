import * as React from "react";
import Helmet from "react-helmet";

import "prismjs/themes/prism-okaidia.css";
import "../styles/bootstrap.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "react-scroll-up";
import icon512 from "../../assets/icon.png";

import styled from "styled-components";

import { StaticQuery, graphql } from "gatsby";
import { FaArrowUp } from "react-icons/fa";

import { IconContext } from "react-icons";
import { I18nProvider } from "../i18n/I18nContext";
import { ArticleGroups } from "../models/ArticleGroups";

interface SiteMetaData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
    },
  };
}

interface Props {
  location: Location;
  children: React.ReactNode;
  articleGroups: ArticleGroups;
}

const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .icons {
    margin-top: -2px;
    margin-right: 4px;
  }

  .link-anchor {
    fill: white;
  }
`;

function RealLayout({ children, location, articleGroups, data }: Props & { data: SiteMetaData }) {
  return (
    <IconContext.Provider value={{ className: "icons" }}>
      <I18nProvider >
        <LayoutRoot>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: "description", content: data.site.siteMetadata.description },
              { name: "keywords", content: "gatsbyjs, gatsby, javascript, sample, something" },
            ]}
            link={[
              { rel: "icon", type: "image/png", href: icon512 },
              { rel: "shortcut icon", type: "image/png", href: icon512 },
            ]}
          />
          <Header articleGroups={articleGroups} title={data.site.siteMetadata.title} location={location} />
          <LayoutMain>{children}</LayoutMain>
          <ScrollToTop showUnder={160}>
            <h3><FaArrowUp /></h3>
          </ScrollToTop>
          <Footer />
        </LayoutRoot>
      </I18nProvider>
    </IconContext.Provider>
  );
}

export default function RootLayout(props: Props) {
  return (
    <StaticQuery query={query}>
      {(data: SiteMetaData) => <RealLayout {...props} data={data} />}
    </StaticQuery>
  );
}
