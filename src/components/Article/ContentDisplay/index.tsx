import React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "@/styles/prism/vscode.css";
import components from "@/configs/article/InlineComponentConfig";
import rehypeReact from "rehype-react";
import { HtmlAst } from "@/models/HtmlAst";
import addSlug from "@/components/Article/ContentDisplay/astManipulators/addSlug";
import addCodeHeader from "@/components/Article/ContentDisplay/astManipulators/addCodeHeader";

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

const ArticleContentDisplay: React.FC<Props> = ({ htmlAst, headings }) => {
  addSlug(headings.map((x) => x.slug))(htmlAst);
  addCodeHeader(htmlAst);

  return (
    <MarkdownDisplay className="markdown">
      {renderAst(htmlAst)}
    </MarkdownDisplay>
  );
}

export default ArticleContentDisplay;
