import React, { useEffect } from "react";
import { MdToc } from "react-icons/md";
import styled from "styled-components";

import { scrollToAnchor } from "@/components/Article/TocPanel/scrollToAnchor";
import { Localized } from "@/i18n";
import { Heading } from "@/models/ArticleNode";
import { colors,heights } from "@/styles/variables";

interface Props {
  headings: Heading[];
  className?: string;
}

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

const List = styled.ol`
  list-style: none;
  padding-left: 0;
  overflow: hidden;
  max-height: 50vh;

  &:hover {
    overflow: auto;
  }
`;

const Item = styled.li`
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
      <p><MdToc /><Localized id="articlePage.toc" /></p>
      <List>
        {headings.map((heading) => {
          return (
            <Item
              id={`tocitem-${heading.slug}`}
              key={heading.slug}
              depth={heading.depth}
              onClick={scrollToAnchor(heading.slug)}
            >
              {heading.value}
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default TocPanel;
