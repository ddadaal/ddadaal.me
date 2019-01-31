import { AstManipulator } from './AstManipulator';
import { HtmlAst, HtmlAstElement, HtmlAstChild } from "@/models/HtmlAst";

const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];

function rec(el: HtmlAstChild, slugs: string[]) {
  if (slugs.length === 0) {
    return;
  }
  if (el.type === "element") {
    if (headings.includes(el.tagName)) {
      el.properties.id = slugs.pop() as string;
    }
    for (const child of el.children) {
      rec(child, slugs);
    }
  }
}

function addSlug(slugs: string[]): AstManipulator {
  const reversed = slugs.reverse();
  return (htmlAst: HtmlAst) => {
    for (const el of htmlAst.children) {
        rec(el, reversed);
    }
  }
}

export default addSlug;
