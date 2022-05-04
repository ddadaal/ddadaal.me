import { HtmlAst, HtmlAstChild } from "@/models/HtmlAst";

import { AstManipulator } from "./AstManipulator";

const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];

function addSlug(slugs: string[]): AstManipulator {

  slugs.reverse();

  function rec(el: HtmlAstChild): void {
    if (slugs.length === 0) {
      return;
    }
    if (el.type === "element") {
      if (headings.includes(el.tagName)) {
        el.properties.id = slugs.pop() as string;
      }
      for (const child of el.children) {
        rec(child);
      }
    }
  }

  return (htmlAst: HtmlAst) => {
    for (const el of htmlAst.children) {
      rec(el);
    }
  };
}

export default addSlug;
