import "./article-tag.scss";

import { Link } from "gatsby";
import React from "react";
import { useStore } from "simstate";
import styled from "styled-components";

import { LanguageId, useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

const Tag = styled(Link)`
  margin-right: 4px;
`;

interface Props {
  tag: string;
}

const ArticleTag: React.FC<Props> = ({ tag }) => {
  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const tagOfLang = metadataStore.getTagOfLang(tag, i18n.currentLanguage.id as LanguageId)
   || tag;

  const title = i18n.translate(
    "articleFrontmatter.tagLinkTitle", [` ${tagOfLang} `]) as string;
  const toLink = `/articles/search?query=${tagOfLang}`;

  return (
    <Tag className="badge badge-info article-tag" to={toLink} title={title}>
      {tagOfLang}
    </Tag>
  );
};

export default ArticleTag;
