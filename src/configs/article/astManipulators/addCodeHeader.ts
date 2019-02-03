import { HtmlAstElement } from '@/models/HtmlAst';
import { HtmlAst } from '@/models/HtmlAst';
import { AstManipulator, createElement, createText } from '@/configs/article/astManipulators/AstManipulator';

import "./code-header.scss";

function visit(el: HtmlAstElement) {
  if (el.type === "element" && el.tagName === "div" && el.properties.dataLanguage) {
    const language = el.properties.dataLanguage;

    const pre = el.children[0];

    if (pre.type === "element") {
      pre.children.unshift(
        createElement("div", { className: "code-header" }, [
          createElement("div", { className: "code-header-inner"}, [
            createText(language)
          ])
        ])
      )
    }

    el.children.forEach(visit);
  }
}

export default function addCodeHeader(htmlAst: HtmlAst) {
  htmlAst.children.forEach(visit);
}


