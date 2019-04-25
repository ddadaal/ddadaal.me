import React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "@/styles/prism-vs.css";

import components from "@/configs/article/InlineComponentConfig";

import rehypeReact from "rehype-react";
import { HtmlAst } from "@/models/HtmlAst";
import addSlug from "@/components/Article/ContentDisplay/astManipulators/addSlug";
import addCodeHeader from "@/components/Article/ContentDisplay/astManipulators/addCodeHeader";
import { widths } from "@/styles/variables";

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler;

interface Props {
  htmlAst: HtmlAst;
  headings: Heading[];
}

const MarkdownDisplay = styled.article`
  max-width: ${widths.articleContent}px;
  margin-left: auto;
  margin-right: auto;
`;

export default function ArticleContentDisplay(props: Props) {
  const { htmlAst, headings } = props;

  addSlug(headings.map((x) => x.slug))(htmlAst);
  addCodeHeader(htmlAst);

  return (
    <MarkdownDisplay className="markdown">
      {renderAst(htmlAst)}
    </MarkdownDisplay>
  );
}
