import { HtmlAstElement, HtmlAstText, HtmlAstChild } from "@/models/HtmlAst";
import { HtmlAst } from "@/models/HtmlAst";

export type AstManipulator = (htmlAst: HtmlAst) => void;

export function createText(text: string): HtmlAstText {
  return {
    type: "text",
    value: text,
  };
}

export function createElement(
  tagName: string,
  properties: {[key: string]: string} = {},
  children: HtmlAstChild[] = [],
): HtmlAstElement {
  return {
    type: "element",
    tagName,
    properties,
    children,
  };
}
