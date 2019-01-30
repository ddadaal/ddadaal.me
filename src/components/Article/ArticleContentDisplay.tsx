import * as React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

import components from "@/configs/InlineComponentConfig";

import rehypeReact from "rehype-react"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler;

interface Props {
  htmlAst: object;
  headings: Heading[];
}

const MarkdownDisplay = styled.article`
`;

export default class ArticleContentDisplay extends React.Component<Props> {


  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {

    // add header slug
    var headingElements = this.ref.current!.querySelectorAll('h1,h2,h3,h4,h5,h6');

    this.props.headings.forEach((heading, index) => {
      headingElements[index].id = heading.slug;
    });

  }

  render() {
    return (
      <MarkdownDisplay ref={this.ref} className="markdown">
      {renderAst(this.props.htmlAst)}
      </MarkdownDisplay>
    )
  }

}
