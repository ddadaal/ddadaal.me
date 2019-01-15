import * as React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

interface Props {
  html: string;
  headings: Heading[];
}

const MarkdownDisplay = styled.article`
`;

export default class ArticleContentDisplay extends React.Component<Props> {


  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {

    var headingElements = this.ref.current!.querySelectorAll('h1,h2,h3,h4,h5,h6');

    this.props.headings.forEach((heading, index) => {
      headingElements[index].id = heading.slug;
    });
  }

  render() {
    return (
      <MarkdownDisplay ref={this.ref} className="markdown" dangerouslySetInnerHTML={{ __html: this.props.html }} />
    )
  }

}
