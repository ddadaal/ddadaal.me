import { dirname, join } from "path";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeRewrite from "rehype-rewrite";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import RSS from "rss";
import { getArticleBasePath } from "src/data/articleBasePath";
import { readArticlesCached } from "src/data/articles";
import { tags } from "src/data/tags";
import { WEBSITE_BASE_URL } from "src/utils/constants";
import { fromArticleTime } from "src/utils/datetime";
import { serverTime } from "src/utils/serverTime";
import { unified } from "unified";

const renderContent = async (content: string, articleFilePath: string) => {

  const articleDirPath = dirname(articleFilePath);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRewrite, {
      rewrite: (node) => {

        if (node.type === "element" && node.tagName === "img" && node.properties) {
          const src = node.properties.src as string;

          if (src.startsWith("http://") || src.startsWith("https://")) {
            return;
          }

          const imagePath = join(articleDirPath, src);

          node.properties.src = WEBSITE_BASE_URL + join("/articles/asset", imagePath);
        }
      },
    })
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
    })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);

  return result.toString();
};

const getTagNameFromArticleLang = (lang: string, tag: string) => {
  return tags.find((x) => x.tag === tag)?.[lang as "cn" | "en"] ?? tag;
};

export const generateRss = async () => {
  const articles = await readArticlesCached();

  const feed = new RSS({
    site_url: WEBSITE_BASE_URL,
    feed_url: WEBSITE_BASE_URL + "/rss.xml",
    title: "ddadaal.me",
    image_url: WEBSITE_BASE_URL + "/favicon.ico",
    description: "ddadaal's personal website",
    pubDate: serverTime.toJSDate(),
    webMaster: "ddadaal@outlook.com",
    copyright: "CC BY-SA 4.0",
    categories: ["Life", "Technology", "Programming", "Software"],
  });

  for (const articleItem of articles) {

    for (const article of articleItem.langVersions) {

      feed.item({
        date: fromArticleTime(article.date).toJSDate(),
        description: await renderContent(article.content, article.filePath),
        title: article.title,
        url: WEBSITE_BASE_URL + join(getArticleBasePath(article), article.lang),
        categories: article.tags?.map((x) => getTagNameFromArticleLang(article.lang, x)),
      });
    }
  }

  const xml = feed.xml({ indent: true });

  return xml;

};
