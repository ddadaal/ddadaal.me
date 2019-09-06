import React, { useCallback } from "react";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import I18nStore from "@/stores/I18nStore";
import lang from "@/i18n/lang";
import styled from "styled-components";
import { Link } from "gatsby";
import { Badge } from "reactstrap";
import { colors } from "@/styles/variables";

interface Props {
  onClick?(tags: string): void;
  tag: string;
}

const Item = styled(Link)`
  margin: 0 4px 4px 0;
  display: inline-block;

  padding: 2px;

  background-color: ${colors.extremelyLightGray};

  &:hover {
    background-color: ${colors.lightGray};
    text-decoration: none;
  }

  transition: background-color 0.2s linear;

`;

const Text = styled.span`
    color: black;
    padding: 4px;
    font-size: 14px;

`;

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
    <Item title={title} to={toLink} onClick={clickHandler}>
      <Text>{tagOfLang}</Text>
      <Badge color={"info"}>{count}</Badge>
    </Item>
  );

}

export default CountedArticleTag;
