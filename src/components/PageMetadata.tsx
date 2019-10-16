import React from "react";
import { Helmet, HelmetProps } from "react-helmet";
import MetadataStore from "@/stores/MetadataStore";
import { useStore } from "simstate";
import I18nStore from "@/stores/I18nStore";
import lang from "@/i18n/lang";

const root = lang.pageMedatadata;

interface Props extends HelmetProps {
  title?: string;
  titleId?: string;
  description?: string;
  descriptionId?: string;
  url?: string;
  locale?: string;
}

export const PageMetadata: React.FC<Props> = ({ title, titleId, description, descriptionId, meta, url, locale, ...rest }) => {

  const i18nStore = useStore(I18nStore);
  const { siteMetadata } = useStore(MetadataStore);

  const actualTitle = title ? title : titleId ? i18nStore.translate(titleId) : null;

  const titleStr = `${actualTitle ? `${actualTitle} | ` : ""}${siteMetadata.name}`;

  const descriptionStr = description ? description : i18nStore.translate(descriptionId || root.description) as string;

  const localeStr = locale || i18nStore.language.metadata.detailedId;

  return (
    <Helmet
      title={titleStr}
      htmlAttributes={{ lang: localeStr }}
      meta={[
        { name: "description", content: descriptionStr },
        { name: "og:title", content: titleStr },
        { name: "og:description", content: descriptionStr },
        { name: "og:url", content: `${siteMetadata.siteUrl}${url || ""}` },
        { name: "og:site_name", content: siteMetadata.name },
        { name: "og:locale", content: localeStr },
        ...(meta || []),
      ]}
      {...rest}
    />
  )
}
