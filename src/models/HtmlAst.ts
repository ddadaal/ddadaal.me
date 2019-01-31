
export interface HtmlAstText {
  type: "text";
  value: string;
}

export interface HtmlAstElement {
  type: "element";
  tagName: string;
  properties: { [key: string]: string };
  children: HtmlAstChild[];
}

export type HtmlAstChild = HtmlAstText | HtmlAstElement;


export interface HtmlAst {
  type: string;
  data: {
    quirksMode: boolean;
  };
  children: HtmlAstChild[]
}
