import "@/styles/index.scss";

import React from "react";
import { IconContext } from "react-icons";
import { createStore, StoreProvider } from "simstate";
import styled from "styled-components";

import { PageMetadata } from "@/components/PageMetadata";
import ToTop from "@/components/ToTop";
import UpdatePop from "@/components/UpdatePop";
import { ProviderWithChildren } from "@/i18n";
import cn from "@/i18n/cn";
import { ArticleNode } from "@/models/ArticleNode";
import { SiteMetadata } from "@/models/SiteMetadata";
import { Tag } from "@/models/Tag";
import ArticleStore from "@/stores/ArticleStore";
import LocationStore, { LocationProvider } from "@/stores/LocationStore";
import MetadataStore from "@/stores/MetadataStore";
import useConstant from "@/utils/useConstant";
import icon512 from "~/assets/icon.png";

const initialLanguage = {
  id: "cn",
  definitions: cn,
};

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
  children?: React.ReactNode;
  tags: Tag[];
}

const iconContext = { className: "icons" };

const RootLayout: React.FC<Props> = ({
  location, articles,
  siteMetadata, tags, children,
}) => {

  const locationStore = useConstant(() => createStore(LocationStore, location));

  const metadataStore = useConstant(() => createStore(MetadataStore,
    siteMetadata,
    articles,
    tags,
  ));

  const articleStore = useConstant(() => createStore(ArticleStore, null));

  return (
    <ProviderWithChildren initialLanguage={initialLanguage}>
      <IconContext.Provider value={iconContext}>
        <StoreProvider stores={[
          locationStore,
          metadataStore,
          articleStore,
        ]}
        >
          <LocationProvider location={location} />
          <LayoutRoot>
            <PageMetadata
              meta={[
                { name: "keywords", content: "gatsbyjs, gatsby, react, ddadaal, blog" },
                { name: "author", content: "ddadaal" },
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
            {children}
          </LayoutRoot>
        </StoreProvider>
      </IconContext.Provider>
    </ProviderWithChildren>
  );
};

export default RootLayout;
