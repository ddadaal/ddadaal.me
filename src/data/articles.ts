import { existsSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import matter from "gray-matter";
import { basename, extname, join } from "path";
import readingTime from "reading-time";
import { createDataSource } from "src/data/data";

import { ArticleSummary } from "../../ai/summarize.mjs";

export const revalidate = false;

const CONTENT_DIR = "contents";

export interface Article {
  id: string;
  title: string;
  date: string;
  last_updated?: string;
  lang: string;
  tags?: string[];
  related?: string[];
  ignored_in_list?: boolean;
  no_toc?: boolean;
  hide_heading?: boolean;
  absolute_path?: string;

  content: string;

  wordCount: number;
  readingTime: number;

  filePath: string;

  summaries?: string[];
}

export interface ArticleItem {
  id: string;
  folderDate?: { year: number; month: number; day: number };
  langVersions: Article[];
}

interface ArticleFrontmatterData {
  id: string;
  title: string;
  date: string;
  lang: string;
  tags?: string[];
  related?: string[];
  ignored_in_list?: boolean;
  no_toc?: boolean;
  hide_heading?: boolean;
  absolute_path?: string;
  last_updated?: string;
}

const acceptedFileTypes = [".md", ".mdx"];

export const readArticleFromDir = async (dir: string) => {

  let item: ArticleItem | undefined = undefined;

  for (const file of await readdir(dir)) {

    if (!acceptedFileTypes.includes(extname(file))) {
      continue;
    }

    const filePath = join(dir, file);

    const fileContent = await readFile(filePath, "utf-8");
    const { content, data } = matter(fileContent);

    const typedData = data as ArticleFrontmatterData;

    const folderDate = /^(\d{4})(\d{2})(\d{2})/.exec(basename(dir));

    if (!item) {
      item = {
        id: typedData.id,
        folderDate: folderDate ? { year: +folderDate[1], month: +folderDate[2], day: +folderDate[3] } : undefined,
        langVersions: [],
      };
    }

    const { words, minutes } = readingTime(content);

    let summaries: string[] | undefined;

    const summariesFilePath = join(dir, `${typedData.lang}.summary.json`);

    if (existsSync(summariesFilePath)) {
      const articleSummary = JSON.parse(await readFile(summariesFilePath, "utf-8")) as ArticleSummary;

      summaries = articleSummary.summaries;
    }

    item.langVersions.push({
      content,
      title: typedData.title,
      date: typedData.date,
      id: typedData.id,
      lang: typedData.lang,
      tags: typedData.tags,
      related: typedData.related,
      ignored_in_list: typedData.ignored_in_list,
      hide_heading: typedData.hide_heading,
      no_toc: typedData.no_toc,
      absolute_path: typedData.absolute_path,
      last_updated: typedData.last_updated,

      wordCount: words,
      readingTime: minutes,

      filePath,

      summaries,
    });
  }

  if (item) {
    item.langVersions.sort((a, b) => a.lang.localeCompare(b.lang));
  }

  return item;
};

export const readArticles = async () => {

  const articleDirs = await readdir(CONTENT_DIR);

  const articles: ArticleItem[] = [];

  for (const dir of articleDirs) {

    const path = join(CONTENT_DIR, dir);

    if ((await stat(path)).isFile()) {
      continue;
    }

    const item = await readArticleFromDir(path);

    if (item?.folderDate && item.langVersions.every((x) => !x.ignored_in_list)) {
      articles.push(item);
    }
  }

  // sort by folder date
  articles.sort((a, b) => {
    if (!a.folderDate || !b.folderDate) {
      return 0;
    }

    return new Date(b.folderDate.year, b.folderDate.month - 1, b.folderDate.day).getTime()
      - new Date(a.folderDate.year, a.folderDate.month - 1, a.folderDate.day).getTime();
  });

  return articles;
};

export const readArticlesCached = createDataSource({
  watchPath: CONTENT_DIR,
  loader: readArticles,
});

export interface ArticleListInfo {
  id: string;

  langVersions: {
    title: string;
    date: string;
    last_updated?: string;
    excerpt: string;
    lang: string;
    tags?: string[];

    wordCount: number;
    readingTime: number;
    absolute_path?: string;
  }[];
}

export const generateExcerpt = (content: string) => {
  return content.substring(0, 200);
};

export function convertToListInfo(x: ArticleItem): ArticleListInfo {
  return {
    id: x.id,
    langVersions: x.langVersions.map((y) => ({
      excerpt: generateExcerpt(y.content),
      date: y.date,
      last_updated: y.last_updated,
      lang: y.lang,
      readingTime: y.readingTime,
      title: y.title,
      wordCount: y.wordCount,
      tags: y.tags,
      absolute_path: y.absolute_path,
    })),
  };
}
