import React from "react";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { Badge } from "reactstrap";
import { Link } from "gatsby";
import styled from "styled-components";
import lang from "@/i18n/lang";
import { I18nStore } from "@/stores/I18nStore";

const Tag = styled(Link)`
  margin-right: 4px;

  a {
    color: white;
  }
`;

interface Props {
  tag: string;
  containsCount?: boolean;
}

export default function ArticleTag({ tag, containsCount }: Props) {
  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const tagOfLang = metadataStore.getTagOfLang(tag, i18nStore.language) || tag;

  const title = i18nStore.translate(lang.articleFrontmatter.tagLinkTitle, [` ${tagOfLang} `]) as string;
  const toLink = `/search?query=${tagOfLang}`;
  const count = metadataStore.getCountOfTag(tag);

  return (
    <Tag className="badge badge-info" to={toLink} title={title}>
      {tagOfLang} {containsCount ? `(${count})` : null}
    </Tag>
  );
}
