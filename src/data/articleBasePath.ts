import { Article } from "src/data/articles";

export const getArticleBasePath = (article: Pick<Article, "absolute_path" | "id">) => {
  return article.absolute_path ?? `/articles/${article.id}`;
};
