import React, { useEffect } from "react";
import { Heading } from "@/models/ArticleNode";
import { MdToc } from "react-icons/md";
import { LocalizedString } from "simstate-i18n";
import { lang } from "@/i18n";
import styled from "styled-components";
import { heights, colors } from "@/styles/variables";
import ScrollLinkToAnchor from "./ScrollLinkToAnchor";

interface Props {
  headings: Heading[];
  className?: string;
}

const root = lang.articlePage;

const Container = styled.div`
  border-left: 1px solid lightgray;

  z-index: 1020;

  &> p {
    margin-left: 4px;
  }

`;

interface ItemProps {
  depth: number;
}

const Item = styled(ScrollLinkToAnchor)`
  padding-left: ${(props: ItemProps) => props.depth * 16}px;
  :hover {
    cursor: pointer;
  }
  display: block;
  padding-bottom: 4px;
  color: #fff;
  text-decoration: none;

  &.active {
    border-left: 4px solid ${colors.tocLinkActiveColor};
    padding-left: ${(props: ItemProps) => props.depth * 16 - 4}px;
    color: ${colors.tocLinkActiveColor} !important;
  }

  :hover {
    color: ${colors.tocLinkActiveColor} !important;
    text-decoration: none;
  }
`;

function isWindowBetween(element: HTMLElement | null): boolean {
  return !!element && element.getBoundingClientRect().top - heights.header >= 2;
}

const TocPanel: React.FC<Props> = ({ headings, className }) => {


  useEffect(() => {

    const tocItemElements: HTMLElement[] = [];

    let currentIndex = 0;

    const setActive = (index: number): void => {
      tocItemElements[currentIndex].classList.remove("active");
      currentIndex = index;
      tocItemElements[index].classList.add("active");
    };

    const onScroll = (): void => {

      for (let i = 0; i < headings.length - 1; i++) {
        if (isWindowBetween(document.getElementById(headings[i + 1].slug))) {
          setActive(i);
          return;
        }
      }
      setActive(headings.length - 1);
    };

    if (headings.length === 0) { return; }

    headings.forEach((heading) => {
      // add heading element
      const tocEl = document.getElementById(`tocitem-${heading.slug}`);
      if (tocEl) {
        tocItemElements.push(tocEl);

      }
    });

    setActive(0);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  return (
    <Container className={className}>
      <p><MdToc /><LocalizedString id={root.toc} /></p>
      {headings.map((heading) => {
        return (
          <Item
            id={`tocitem-${heading.slug}`}
            key={heading.slug}
            targetAnchor={heading.slug}
            depth={heading.depth}
          >
            {heading.value}
          </Item>
        );
      })}
    </Container>
  );
};

export default TocPanel;
