import "./code-header.scss";

import { HtmlAst, HtmlAstElement } from "@/models/HtmlAst";

import { createElement, createText } from "./AstManipulator";

const languageTexts = {
  python: "Python",
  csharp: "C#",
  java: "Java",
  tsx: "TypeScript React",
  ts: "TypeScript",
  js: "JavaScript",
  kotlin: "Kotlin",
};

function visit(el: HtmlAstElement): void {
  if (el.type === "element") {
    if (el.tagName === "pre" && el.properties.dataLanguage) {
      const language = el.properties.dataLanguage;

      const pre = el.children[0];

      if (pre.type === "element") {
        pre.children.unshift(
          createElement("div", { className: "code-header" }, [
            createElement("div", { className: "code-header-inner" }, [
              createText(languageTexts[language] || language),
            ]),
          ]),
        );
      }
    }
    el.children.forEach(visit);
  }
}

export default function addCodeHeader(htmlAst: HtmlAst): void {
  htmlAst.children.forEach(visit);
}
