import React from "react";
import { Heading } from "@/models/ArticleNode";
import { MdToc } from "react-icons/md";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
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

  position: sticky;
  top: ${heights.header + 32}px;
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


  &.active {
    border-left: 4px solid ${colors.tocLinkActiveColor};
    padding-left: ${(props: ItemProps) => props.depth * 16 - 4}px;
    color: ${colors.tocLinkActiveColor} !important;
  }

  :hover {
    color: ${colors.tocLinkActiveColor} !important;
  }
`;

interface State {
}

function isWindowBetween(element: HTMLElement) {

  return element.getBoundingClientRect().top - heights.header >= 2;
}

export default class TocPanel extends React.Component<Props, State>  {

  headingElements: HTMLElement[] = [];
  tocItemElements: HTMLElement[] = [];

  currentIndex: number = 0;

  setActive(index: number) {
    this.tocItemElements[this.currentIndex].classList.remove("active");
    this.currentIndex = index;
    this.tocItemElements[index].classList.add("active");
  }

  onScroll = (ev) => {
    const { headings } = this.props;

    for (let i = 0; i < headings.length - 1; i++) {
      if (isWindowBetween(this.headingElements[i + 1])) {
        this.setActive(i);
        return;
      }
    }

    this.setActive(headings.length - 1);

  }

  componentDidMount() {

    if (this.props.headings.length === 0) { return; }

    this.props.headings.forEach((heading) => {
      // add heading element
      const el = document.getElementById(heading.slug);
      const tocEl = document.getElementById(`tocitem-${heading.slug}`);
      if (el && tocEl) {
        this.headingElements.push(el);
        this.tocItemElements.push(tocEl);

      }
    });

    this.setActive(0);

    window.addEventListener("scroll", this.onScroll, true);
  }

  componentWillUnmount() {
    if (this.props.headings.length === 0) { return; }

    window.removeEventListener("scroll", this.onScroll);
  }

  render() {
    return (
      <Container className={this.props.className}>
        <p><MdToc /><LocalizedString id={root.toc} /></p>
        {this.props.headings.map((heading, i) => {
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
  }
}
