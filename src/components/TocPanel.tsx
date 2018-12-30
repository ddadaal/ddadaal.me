import * as React from "react";
import { Heading } from "@/models/ArticleNode";
import GithubSlugger from "github-slugger";
import { MdToc } from "react-icons/md";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import styled from "styled-components";
import { Link } from "gatsby";
import AnchorLink from "react-anchor-link-smooth-scroll";

interface Props {
  headings: Heading[];
}

const root = lang.articlePage;

const Container = styled.div`
  border-left: 1px solid lightgray;
  padding-left: 16px;
`;

const Item = styled(AnchorLink) <{ depth: number }>`
  padding-left: ${props => props.depth * 16}px;
  :hover {
    cursor: pointer;
  }
  display: block;
  padding-top: 2px;
`;

export default function TocPanel({ headings }: Props) {
  const slugger = new GithubSlugger();

  return (
    <Container>
      <p><MdToc /><I18nString id={root.toc} /></p>
      {headings.map((heading, i) => {
        const slugged = slugger.slug(heading.value);
        return (
          <Item key={i} href={`#${slugged}`} depth={heading.depth-1}>
            {heading.value}
          </Item>
        );
      })}
    </Container>
  );
}
