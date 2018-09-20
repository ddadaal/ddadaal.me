export interface ArticleNode {
  excerpt: string;
  id: string;
  frontmatter: {
    absolute_path?: string;
    date: string;
    id_name: string;
    ignored?: boolean;
    tags: string[];
    title: string;
  };
  html: string;
}
