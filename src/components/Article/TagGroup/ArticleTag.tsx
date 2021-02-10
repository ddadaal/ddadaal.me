import React from "react";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import { Link } from "gatsby";
import styled from "styled-components";
import { lang, useI18nStore } from "@/i18n";
import "./article-tag.scss";

const Tag = styled(Link)`
  margin-right: 4px;
`;

interface Props {
  tag: string;
}

const ArticleTag: React.FC<Props> = ({ tag }) => {
  const metadataStore = useStore(MetadataStore);
  const i18nStore = useI18nStore();

  const tagOfLang = metadataStore.getTagOfLang(tag, i18nStore.currentLanguage) || tag;

  const title = i18nStore.translate(
    lang.articleFrontmatter.tagLinkTitle, [` ${tagOfLang} `]) as string;
  const toLink = `/articles/search?query=${tagOfLang}`;

  return (
    <Tag className="badge badge-info article-tag" to={toLink} title={title}>
      {tagOfLang}
    </Tag>
  );
};

export default ArticleTag;
