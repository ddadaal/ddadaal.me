export interface Heading {
  depth: number;
  value: string;
  slug: string;
}

export interface ArticleNode {
  path: string;
  excerpt: string;
  timeToRead: number;
  wordCountChinese: number;
  frontmatter: {
    absolute_path?: string;
    date: string;
    id: string;
    ignored_in_list?: boolean;
    tags: string[] | null;
    title: string;
    hide_heading?: boolean;
    lang: string;
    no_toc?: boolean;
    related?: string[];
  };
}
