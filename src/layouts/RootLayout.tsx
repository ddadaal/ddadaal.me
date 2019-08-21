import React, { useEffect } from "react";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore } from "@/stores/LocationStore";
import { SiteMetadata } from "@/models/SiteMetadata";
import { MetadataStore } from "@/stores/MetadataStore";
import { IconContext } from "react-icons";
import styled from "styled-components";
import Helmet from "react-helmet";
import icon512 from "~/assets/icon.png";
import UpdatePop from "@/components/UpdatePop";
import { StoreProvider } from "simstate";
import { ArticleStore } from "@/stores/ArticleStore";
import ToTop from "@/components/ToTop";
import "@/styles/index.scss";
import { ArticleNode } from "@/models/ArticleNode";
import useConstant from "@/utils/useConstant";

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  word-wrap: break-word;
`;

interface Props {
  location: Location;
  articles: ArticleNode[];
  siteMetadata: SiteMetadata;
  lastUpdated: string;
  children?: React.ReactNode;
  tagMap: TagMap;
}

const iconContext = { className: "icons" };

const RootLayout: React.FC<Props> = (props) => {

  const i18nStore = useConstant(() => new I18nStore());

  const locationStore = useConstant(() => new LocationStore(props.location));

  const metadataStore = useConstant(() => new MetadataStore(
    props.lastUpdated,
    props.articles,
    props.siteMetadata.siteUrl,
    props.tagMap,
  ));

  const articleStore = useConstant(() => new ArticleStore(null));

  useEffect(() => {
    locationStore.updateLocation(props.location);
  }, [props.location]);

  return (
    <IconContext.Provider value={iconContext}>
      <StoreProvider stores={[
        locationStore,
        i18nStore,
        metadataStore,
        articleStore,
      ]}>
        <LayoutRoot>
          <Helmet
            title={props.siteMetadata.title}
            meta={[
              { name: "description", content: props.siteMetadata.description },
              { name: "keywords", content: "gatsbyjs, gatsby, react, viccrubs, vicblog, blog" },
              { name: "og:description", content: props.siteMetadata.description },
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
          <UpdatePop />
          <ToTop />
          {props.children}
        </LayoutRoot>
      </StoreProvider>
    </IconContext.Provider>
  );
}

export default RootLayout;
