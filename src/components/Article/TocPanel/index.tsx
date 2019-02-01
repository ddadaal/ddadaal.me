import * as React from "react";
import { Heading } from "@/models/ArticleNode";
import { MdToc } from "react-icons/md";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import styled from "styled-components";
import { heights } from "@/styles/variables";
import TocPanelLink from "./TocPanelLink";


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

interface State {
  topHeadingIndex: number;
}

function isWindowBetween(heading: Heading) {

  const el = document.getElementById(heading.slug);

  return el && el.getBoundingClientRect().top - heights.header >= 2;
}

export default class TocPanel extends React.Component<Props, State>  {

  state = {
    topHeadingIndex: 0,
  };

  onScroll = (ev) => {
    const { headings } = this.props;

    if (headings.length == 0) { return; }

    for (let i = 0; i < headings.length-1; i++) {

      if (isWindowBetween(headings[i+1])) {
        this.setState({ topHeadingIndex: i });
        return;
      }
    }
    this.setState({ topHeadingIndex: headings.length - 1 });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  render() {
    return (
      <Container className={this.props.className}>
        <p><MdToc /><LocalizedString id={root.toc} /></p>
        {this.props.headings.map((heading, i) => {
          return (
            <TocPanelLink
              key={i}
              targetAnchor={heading.slug}
              depth={heading.depth}
              active={i === this.state.topHeadingIndex}
            >
              {heading.value}
            </TocPanelLink>
          );
        })}
      </Container>
    );
  }
}
