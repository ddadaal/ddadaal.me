export interface HtmlAstElement {
  type: string;
  tagName: string;
  properties: { [key: string]: string };
  children: HtmlAstElement[];
}

export interface HtmlAst {
  type: string;
  data: {
    quirksMode: boolean;
  };
  children: HtmlAstElement[]
}
