import React, { useRef, useEffect } from "react";
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
import icon512 from "~/assets/icon.png";
import { FaArrowUp } from "react-icons/fa";
import NewContentPop from "@/components/NewContentPop";
import { StoreProvider } from "simstate";
import { ArticleStore } from "@/stores/ArticleStore";
import ToTop from "@/components/ToTop";
import { VuThemeProvider } from "@/vicui";
import "normalize.css";

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
  tagMap: TagMap;
}

const iconContext = { className: "icons" };

export default function RootLayout(props: Props) {

  const { location, articleGroups, siteMetadata, statistics, children, tagMap } = props;

  const i18nStore = useRef(new I18nStore()).current;

  const locationStore = useRef(new LocationStore(location)).current;

  const metadataStore = useRef(new MetadataStore(
    statistics,
    articleGroups,
    siteMetadata.siteUrl,
    tagMap,
  )).current;

  const articleStore = useRef(new ArticleStore(null)).current;

  useEffect(() => {
    locationStore.updateLocation(location);
  }, [location]);

  return (
    <IconContext.Provider value={iconContext}>
      <StoreProvider stores={[
        locationStore,
        i18nStore,
        metadataStore,
        articleStore,
      ]}>
        <VuThemeProvider>
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
            <ToTop />

            {children}

          </LayoutRoot>
        </VuThemeProvider>
      </StoreProvider>
    </IconContext.Provider>
  );
}
