import React from "react";
import { createI18nStore } from "simstate-i18n";
import LocationStore, { LocationProvider } from "@/stores/LocationStore";
import { SiteMetadata } from "@/models/SiteMetadata";
import MetadataStore from "@/stores/MetadataStore";
import { IconContext } from "react-icons";
import icon512 from "~/assets/icon.png";
import UpdatePop from "@/components/UpdatePop";
import { StoreProvider, createStore, useStore } from "simstate";
import ArticleStore from "@/stores/ArticleStore";
import ToTop from "@/components/ToTop";
import { ArticleNode } from "@/models/ArticleNode";
import useConstant from "@/utils/useConstant";
import { PageMetadata } from "@/components/PageMetadata";
import { i18nContext } from "@/i18n";
import { MediaContextProvider } from "@/styles/media";
import { Grommet } from "grommet";
import { ThemeStore } from "@/stores/ThemeStore";
import siteTheme from "@/styles/theme";


interface Props {
  location: Location;
  articles: ArticleNode[];
  siteMetadata: SiteMetadata;
  children?: React.ReactNode;
  tags: Tag[];
}

const iconContext = { className: "icons" };


const UI: React.FC = ({ children }) => {
  const themeStore = useStore(ThemeStore);

  return (
    <MediaContextProvider>
      <Grommet theme={siteTheme} full={true} themeMode={themeStore.theme}>
        {children}
      </Grommet>
    </MediaContextProvider>
  );
};


export const RootLayout: React.FC<Props> = ({
  location,
  articles,
  siteMetadata,
  tags,
  children,
}) => {

  const i18nStore = useConstant(() => createI18nStore(i18nContext));
  const locationStore = useConstant(() => createStore(LocationStore, location));
  const metadataStore = useConstant(() => createStore(MetadataStore,
    siteMetadata,
    articles,
    tags,
  ));
  const articleStore = useConstant(() => createStore(ArticleStore, null));
  const themeStore = useConstant(() => createStore(ThemeStore));

  return (
    <IconContext.Provider value={iconContext}>
      <StoreProvider stores={[
        locationStore,
        i18nStore,
        metadataStore,
        articleStore,
        themeStore,
      ]}
      >
        <LocationProvider location={location} />
        <UI>
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
        </UI>
      </StoreProvider>
    </IconContext.Provider>
  );
};
