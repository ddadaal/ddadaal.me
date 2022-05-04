import React from "react";
import { Helmet, HelmetProps } from "react-helmet";
import { useStore } from "simstate";

import { languageInfo, prefix, TextId, useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

const root = prefix("pageMedatadata.");

interface Props extends HelmetProps {
  title?: string;
  titleId?: TextId;
  description?: string;
  descriptionId?: TextId;
  url?: string;
  locale?: string;
}

export const PageMetadata: React.FC<Props> = ({
  title, titleId, description,
  descriptionId, meta, url, locale, ...rest
}) => {

  const i18n = useI18n();
  const { siteMetadata } = useStore(MetadataStore);

  const actualTitle = title ? title : titleId ? i18n.translate(titleId) : null;

  const titleStr = `${actualTitle ? `${actualTitle} | ` : ""}${siteMetadata.name}`;

  const descriptionStr = description
  ?? i18n.translate(descriptionId || root("description")) as string;

  const localeStr = locale || languageInfo[i18n.currentLanguage.id].detailedId;

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
  );
};
