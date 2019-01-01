export interface Heading {
  depth: number;
  value: string;
}


export interface ArticleNode {
  path: string;
  excerpt: string;
  id: string;
  headings: Heading[];
  timeToRead: number;
  wordCount: {
    words: number
  };
  frontmatter: {
    absolute_path?: string;
    date: string;
    id: string;
    ignored?: boolean;
    tags: string[];
    title: string;
    hide_heading?: boolean;
    lang: string;
    no_toc?: boolean;
  };
  html: string;
}
