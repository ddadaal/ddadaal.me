import { Metadata } from "next";
import { Article, generateExcerpt } from "src/data/articles";
import { WEBSITE_BASE_URL } from "src/utils/constants";
import { fromArticleTime } from "src/utils/datetime";

export const generateTitle = (title: string) => title ? `${title} - ddadaal.me` : "ddadaal.me";

export const generateArticleMetadata = (article: Article, langs: string[]): Metadata => {

  return {
    metadataBase: new URL(WEBSITE_BASE_URL),
    title: generateTitle(article.title),
    description: generateExcerpt(article.content),
    keywords: article.tags,
    category: "blog",
    openGraph: {
      title: article.title,
      publishedTime: fromArticleTime(article.date).toISO() ?? undefined,
      alternateLocale: langs,
      locale: article.lang,
    },
  };
};
