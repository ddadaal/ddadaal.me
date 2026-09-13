import { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Article, generateExcerpt } from "src/data/articles";
import { WEBSITE_BASE_URL } from "src/utils/constants";
import { articleTimeToMillis } from "src/utils/datetime";

export const generateTitle = (title: string) => (title ? `${title} - ddadaal.me` : "ddadaal.me");

export const generateArticleMetadata = async (
  article: Article,
  langs: string[],
): Promise<Metadata> => {
  "use cache";
  cacheLife("articles");
  return {
    metadataBase: new URL(WEBSITE_BASE_URL),
    title: generateTitle(article.title),
    description: generateExcerpt(article.content),
    keywords: article.tags,
    category: "blog",
    openGraph: {
      title: article.title,
      publishedTime: new Date(articleTimeToMillis(article.date)).toISOString(),
      alternateLocale: langs,
      locale: article.lang,
    },
  };
};
