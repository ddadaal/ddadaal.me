import React from "react";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { Badge } from "reactstrap";
import { Link } from "gatsby";
import styled from "styled-components";
import lang from "@/i18n/lang";
import { I18nStore } from "@/stores/I18nStore";

const MarginedBadge = styled(Badge)`
  margin-right: 4px;

  a {
    color: white;
  }
`;

interface Props {
  tag: string;
}

export default function ArticleTag({ tag }: Props) {
  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const title = i18nStore.translate(lang.articleFrontmatter.tagLinkTitle, [tag]) as string;

  const tagOfLang = metadataStore.getTagOfLang(tag, i18nStore.language) || tag;

  return (
      <MarginedBadge color={"info"} pill={true} key={tag}>
        <Link to={`/search?query=${tagOfLang}`} title={title}>
          {tagOfLang}
        </Link>
      </MarginedBadge>
  );

}
