import matter from "gray-matter";
import { basename, dirname, extname, join } from "path";
import readingTime from "reading-time";
import { cacheLife, cacheTag } from "next/cache";
import { contentPaths, readContentFile } from "src/data/contentFiles";

import { ArticleSummary } from "../../tools/summarize/index.js";

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

  summary?: ArticleSummary;
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

  for (const filePath of contentPaths) {
    if (dirname(filePath) !== dir || !acceptedFileTypes.includes(extname(filePath))) {
      continue;
    }

    const fileContent = readContentFile(filePath);
    const { content, data } = matter(fileContent);

    const typedData = data as ArticleFrontmatterData;

    const folderDate = /^(\d{4})(\d{2})(\d{2})/.exec(basename(dir));

    if (!item) {
      item = {
        id: typedData.id,
        folderDate: folderDate
          ? { year: +folderDate[1], month: +folderDate[2], day: +folderDate[3] }
          : undefined,
        langVersions: [],
      };
    }

    const { words, minutes } = readingTime(content);

    let summary: ArticleSummary | undefined = undefined;

    const summariesFilePath = join(dir, `${typedData.lang}.summary.json`);

    if (contentPaths.includes(summariesFilePath)) {
      const articleSummary = JSON.parse(readContentFile(summariesFilePath)) as ArticleSummary;

      summary = articleSummary;
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

      summary,
    });
  }

  if (item) {
    item.langVersions.sort((a, b) => a.lang.localeCompare(b.lang));
  }

  return item;
};

const IGNORED_DIRS = ["sparks"];

export const readArticles = async (includeUnlisted = false) => {
  const articleDirs = [...new Set(contentPaths.map((path) => path.split("/")[1]))];

  const articles: ArticleItem[] = [];

  for (const dir of articleDirs) {
    const path = join(CONTENT_DIR, dir);

    if (IGNORED_DIRS.includes(dir)) {
      continue;
    }

    const item = await readArticleFromDir(path);

    if (
      item &&
      (includeUnlisted || (item.folderDate && item.langVersions.every((x) => !x.ignored_in_list)))
    ) {
      articles.push(item);
    }
  }

  // sort by folder date
  articles.sort((a, b) => {
    if (!a.folderDate || !b.folderDate) {
      return 0;
    }

    return (
      new Date(b.folderDate.year, b.folderDate.month - 1, b.folderDate.day).getTime() -
      new Date(a.folderDate.year, a.folderDate.month - 1, a.folderDate.day).getTime()
    );
  });

  return articles;
};

/**
 * Article markdown is part of the image and only changes when a deployment
 * happens. Cache parsed modules so requests do not repeat frontmatter parsing.
 * Turbopack invalidates these modules during development when content changes.
 */
export async function readArticlesCached() {
  "use cache";
  cacheLife("articles");
  cacheTag("articles");
  return readArticles();
}

// Includes article pages outside the blog list, such as /about/me.
export async function readAllArticlesCached() {
  "use cache";
  cacheLife("articles");
  cacheTag("articles");
  return readArticles(true);
}

function readArticleIds(): Set<string> {
  const dirs = [...new Set(contentPaths.map((path) => path.split("/")[1]))];
  const ids = new Set<string>();
  for (const dir of dirs) {
    if (IGNORED_DIRS.includes(dir)) {
      continue;
    }
    const dirPath = join(CONTENT_DIR, dir);
    const filePath = contentPaths.find(
      (path) => dirname(path) === dirPath && acceptedFileTypes.includes(extname(path)),
    );
    if (!filePath) {
      continue;
    }
    const { data } = matter(readContentFile(filePath));
    if (typeof data.id === "string") {
      ids.add(data.id);
    }
  }
  return ids;
}

// Article ids are fixed once the site is built. Compute the set at module load
// so the views API can validate ids without re-reading content per request.
export const articleIds: ReadonlySet<string> = readArticleIds();

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
