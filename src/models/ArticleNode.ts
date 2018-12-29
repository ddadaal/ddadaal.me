export interface ArticleNode {
  path?: string;
  excerpt: string;
  id: string;
  frontmatter: {
    absolute_path?: string;
    date: string;
    id: string;
    ignored?: boolean;
    tags: string[];
    title: string;
    hide_heading?: boolean;
    lang: string;
  };
  html: string;
}
