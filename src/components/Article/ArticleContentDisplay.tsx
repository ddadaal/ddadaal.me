import * as React from "react";
import styled from "styled-components";
import { Heading } from "@/models/ArticleNode";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

import components from "@/configs/InlineComponentConfig";

import rehypeReact from "rehype-react"
import { HtmlAst, HtmlAstElement } from "@/models/HtmlAst";

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

function addSlugs(htmlAst: HtmlAst, reversedSlugs: string[]) {
  for (const el of htmlAst.children) {
    rec(el, reversedSlugs);
  }
}

const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];

function rec(el: HtmlAstElement, slugs: string[]) {
  if (slugs.length === 0) {
    return;
  }
  if (el.type === "element") {
    if (headings.includes(el.tagName)) {
      el.properties.id = slugs.pop() as string;
      console.log(el);
    }
    for (const child of el.children) {
      rec(child, slugs);
    }
  }
}

export default function ArticleContentDisplay(props: Props) {
  const { htmlAst, headings } = props;

  // add slugs
  // reverse slugs
  const slugs = headings.map((x) => x.slug).reverse();
  addSlugs(htmlAst, slugs);

  return (
    <MarkdownDisplay className="markdown">
      {renderAst(htmlAst)}
    </MarkdownDisplay>
  );
}
