import { ArticleItem } from "src/data/articles";

export const countTags = (
  articles: ArticleItem[],
) => {
  const tags = {} as Record<string, number>;

  for (const article of articles) {
    // only count one article
    const articleOfLang = article.langVersions[0];

    if (articleOfLang.tags) {
      for (const tag of articleOfLang.tags) {
        tags[tag] = (tags[tag] || 0) + 1;
      }
    }
  }

  // sort entries by count
  const entries = Object.entries(tags).map((x) => ({ tag: x[0], count: x[1] }));
  entries.sort((a, b) => b.count - a.count);

  return entries;
};
