import React from "react";
import rehypeReact from "rehype-react";
import styled from "styled-components";

import Contacts from "@/components/Contacts";
import ResumeLayout from "@/layouts/ResumeLayout";
import { Heading } from "@/models/ArticleNode";
import { HtmlAst } from "@/models/HtmlAst";
import useConstant from "@/utils/useConstant";

import addCodeHeader from "./astManipulators/addCodeHeader";
import addSlug from "./astManipulators/addSlug";

const components = {
  "resume": ResumeLayout,
  "feedback-contacts": () => <Contacts color={"black"} size={1.4} />,
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  // @ts-ignore
  components,
}).Compiler;

interface Props {
  htmlAst: HtmlAst;
  headings: Heading[];
}

const MarkdownDisplay = styled.article`
`;

const ArticleContentDisplay: React.FC<Props> = ({ htmlAst, headings }) => {
  useConstant(() => {
    addSlug(headings.map((x) => x.slug))(htmlAst);
    addCodeHeader(htmlAst);
  });

  return (
    <MarkdownDisplay className="markdown">
      {renderAst(htmlAst)}
    </MarkdownDisplay>
  );
};

export default ArticleContentDisplay;
