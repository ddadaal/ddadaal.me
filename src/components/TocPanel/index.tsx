import * as React from "react";
import { Heading } from "@/models/ArticleNode";
import { MdToc } from "react-icons/md";
import I18nString from "@/i18n/I18nString";
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

function getTop(heading: Heading) {
  return document.getElementById(heading.slug)!.getBoundingClientRect().top - heights.header;
}

function isWindowBetween(el1: Heading, el2: Heading) {
  try {
    return getTop(el1) < 2 && getTop(el2) >= 2;
  } catch (e) {
    return false;
  }
}

export default class TocPanel extends React.Component<Props, State>  {

  state = {
    topHeadingIndex: 0,
  };

  onScroll = (ev) => {
    // this.timer = setTimeout(() => {

    const { headings } = this.props;

    if (headings.length == 0) { return; }
    if (getTop(headings[0]) > 0) {
      this.setState({ topHeadingIndex: 0 });
      return;
    }

    for (let i = 1; i < headings.length; i++) {

      if (isWindowBetween(headings[i - 1], headings[i])) {
        this.setState({ topHeadingIndex: i - 1 });
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
        <p><MdToc /><I18nString id={root.toc} /></p>
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
