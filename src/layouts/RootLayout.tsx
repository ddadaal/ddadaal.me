import React from "react";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore } from "@/stores/LocationStore";
import { ArticleGroups } from "@/models/ArticleGroups";
import { SiteMetadata } from "@/models/SiteMetadata";
import { MetadataStore } from "@/stores/MetadataStore";
import { Statistics } from "@/models/Statistics";
import { IconContext } from "react-icons";
import styled from "styled-components";
import Helmet from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "react-scroll-up";
import icon512 from "~/assets/icon.png";
import { FaArrowUp } from "react-icons/fa";
import NewContentPop from "@/components/NewContentPop";
import { StoreProvider } from "simstate";
import { ArticleStore } from "@/stores/ArticleStore";

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  word-wrap: break-word;
`;

interface Props {
  location: Location;
  articleGroups: ArticleGroups;
  siteMetadata: SiteMetadata;
  statistics: Statistics;
  children?: React.ReactNode;
}

const iconContext = { className: "icons" };

export default class RootLayout extends React.Component<Props, {}> {

  i18nStore = new I18nStore();

  locationStore = new LocationStore(this.props.location);

  metadataStore = new MetadataStore({
    articleGroups: this.props.articleGroups,
    baseUrl: this.props.siteMetadata.siteUrl,
    statistics: this.props.statistics,
  });

  articleStore = new ArticleStore(undefined);

  componentDidUpdate() {
    this.updateLocation();
  }

  componentDidMount() {
    this.updateLocation();
  }

  updateLocation() {
    this.locationStore.updateLocation(this.props.location);
  }

  render() {
    const { children, siteMetadata } = this.props;

    return (
      <IconContext.Provider value={iconContext}>
        <StoreProvider stores={[
          this.locationStore,
          this.i18nStore,
          this.metadataStore,
          this.articleStore,
        ]}>
          <LayoutRoot>
            <Helmet
              title={siteMetadata.title}
              meta={[
                { name: "description", content: siteMetadata.description },
                { name: "keywords", content: "gatsbyjs, gatsby, react, viccrubs, vicblog, blog" },
                { name: "og:description", content: siteMetadata.description },
              ]}
              link={[
                { rel: "icon", type: "image/png", href: icon512 },
                { rel: "shortcut icon", type: "image/png", href: icon512 },
              ]}
              script={[
                {
                  type: "text/javascript",
                  src: "https://s5.cnzz.com/z_stat.php?id=1276500124&web_id=1276500124",
                  async: true,
                },
              ]}
            />
            <NewContentPop />
            <Header title={siteMetadata.title} />
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
