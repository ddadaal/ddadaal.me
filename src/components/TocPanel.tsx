import * as React from "react";
import { Heading } from "@/models/ArticleNode";
import GithubSlugger from "github-slugger";
import { MdToc } from "react-icons/md";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import styled from "styled-components";
import { Link } from "gatsby";
import LinkToAnchor from "./LinkToAnchor";
import { heights } from "@/styles/variables";

interface Props {
  headings: Heading[];
  className?: string;
}

const root = lang.articlePage;

const Container = styled.div`
  border-left: 1px solid lightgray;
  padding-left: 16px;

  position: sticky;
  top: ${heights.header + 32}px;
  z-index: 1020;

`;

const Item = styled(LinkToAnchor)<{ depth: number }>`
  padding-left: ${props => props.depth * 16}px;
  :hover {
    cursor: pointer;
  }
  display: block;
  padding-top: 2px;
`;

interface State {
  topHeadingIndex: number;
}

function isElementOutViewport(el: Element) {
  var rect = el.getBoundingClientRect();
  return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
}

export default class TocPanel extends React.Component<Props, State>  {

  state = {
    topHeadingIndex: 0,
  };

  timer: NodeJS.Timeout | undefined = undefined;

  onScroll = (ev) => {
    // if (typeof this.timer === 'number') {
    //   clearTimeout(this.timer);
    // }
    // // this.timer = setTimeout(() => {
    // const items = document.getElementsByClassName("toc-item");
    // for (let i = 0; i < items.length; i++) {
    //   const item = items[i];
    //   const element = document.getElementById(item.id.slice(3))!;
    //   if (!isElementOutViewport(element)) {
    //     this.setState({ topHeadingIndex: i });

    //     break;
    //   }
    // }
    // }, 200);
  };

  // componentDidMount() {
  //   window.addEventListener("scroll", this.onScroll, false);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("scroll", this.onScroll);
  // }

  render() {
    const slugger = new GithubSlugger();

    return (
      <Container className={this.props.className}>
        <p><MdToc /><I18nString id={root.toc} /></p>
        {this.props.headings.map((heading, i) => {
          const slugged = slugger.slug(heading.value);
          return (
            <Item
              className="toc-item"
              id={`${i}`}
              key={i}
              href={`#${slugged}`}
              depth={heading.depth - 1}
            // active={i === this.state.topHeadingIndex}
            >
              {heading.value}
            </Item>
          );
        })}
      </Container>
    );
  }

}
