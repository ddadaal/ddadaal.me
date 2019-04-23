export interface Heading {
  depth: number;
  value: string;
  slug: string;
}

export interface ArticleNode {
  path: string;
  excerpt: string;
  wordCount: {
    words: number,
  };
  frontmatter: {
    absolute_path?: string;
    date: string;
    id: string;
    ignored?: boolean;
    tags: string[] | null;
    title: string;
    hide_heading?: boolean;
    lang: string;
    no_toc?: boolean;
    related?: string[];
  };
}
