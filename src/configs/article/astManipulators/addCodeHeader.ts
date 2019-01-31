import { HtmlAstElement } from '@/models/HtmlAst';
import { HtmlAst } from '@/models/HtmlAst';
import { AstManipulator, createElement, createText } from '@/configs/article/astManipulators/AstManipulator';

function visit(el: HtmlAstElement) {
  if (el.type === "element" && el.tagName === "div" && el.properties.dataLanguage) {
    const language = el.properties.dataLanguage;

    el.children.unshift(
      createElement("div", {}, [
        createElement("pre", { className: `language-${language}` }, [
          createText(language)
        ])
      ])
    )

    el.children.forEach(visit);
  }
}

export default function addCodeHeader(htmlAst: HtmlAst) {
  htmlAst.children.forEach(visit);
}


