import React, { useCallback } from "react";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import I18nStore from "@/stores/I18nStore";
import lang from "@/i18n/lang";
import { Link } from "gatsby";
import { Badge } from "reactstrap";
import "./article-tag.scss";

interface Props {
  onClick?(tags: string): void;
  tag: string;
}

const CountedArticleTag: React.FC<Props> = ({ tag, onClick }) => {
  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const tagOfLang = metadataStore.getTagOfLang(tag, i18nStore.language) || tag;

  const title = i18nStore.translate(lang.articleFrontmatter.tagLinkTitle, [` ${tagOfLang} `]) as string;
  const toLink = `/articles/search?query=${tagOfLang}`;
  const count = metadataStore.getCountOfTag(tag);

  const clickHandler = useCallback(() => {
    if (onClick) {
      onClick(tag);
    }
  }, [onClick, tag]);

  return (
    <Link className="counted-article-tag" title={title} to={toLink} onClick={clickHandler}>
      <span className="counted-article-tag__name">{tagOfLang}</span>
      <Badge color={"info"}>{count}</Badge>
    </Link>
  );

}

export default CountedArticleTag;
