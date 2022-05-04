import "./article-tag.scss";

import { Link } from "gatsby";
import React, { useCallback } from "react";
import { Badge } from "reactstrap";
import { useStore } from "simstate";

import { LanguageId, useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

interface Props {
  onClick?(tags: string): void;
  tag: string;
}

const CountedArticleTag: React.FC<Props> = ({ tag, onClick }) => {
  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const tagOfLang = metadataStore.getTagOfLang(tag, i18n.currentLanguage.id as LanguageId)
   || tag;

  const title = i18n.translate(
    "articleFrontmatter.tagLinkTitle", [` ${tagOfLang} `]) as string;
  const toLink = `/articles/search?query=${tagOfLang}`;
  const count = metadataStore.getCountOfTag(tag);

  const clickHandler = useCallback(() => {
    if (onClick) {
      onClick(tag);
    }
  }, [onClick, tag]);

  return (
    <Link className="counted-article-tag"
      title={title} to={toLink} onClick={clickHandler}
    >
      <span className="counted-article-tag__name">{tagOfLang}</span>
      <Badge color={"info"}>{count}</Badge>
    </Link>
  );

};

export default CountedArticleTag;
