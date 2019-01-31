import * as React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "@/styles/prism-vs.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

import components from "@/configs/article/InlineComponentConfig";

import rehypeReact from "rehype-react"
import { HtmlAst } from "@/models/HtmlAst";
import { AstManipulator } from "@/configs/article/astManipulators/AstManipulator";
import addSlug from "@/configs/article/astManipulators/addSlug";
import addCodeHeader from "@/configs/article/astManipulators/addCodeHeader";

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler;

interface Props {
  htmlAst: HtmlAst;
  headings: Heading[];
}

const MarkdownDisplay = styled.article`
`;

export default function ArticleContentDisplay(props: Props) {
  const { htmlAst, headings } = props;


  addSlug(headings.map((x) => x.slug))(htmlAst);
  // addCodeHeader(htmlAst);

  return (
    <MarkdownDisplay className="markdown">
      {renderAst(htmlAst)}
    </MarkdownDisplay>
  );
}
