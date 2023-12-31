import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { createDataSource } from "src/data/data";

import type { ArticleSummary } from "../../ai/summarize.mjs";

const CONTENTS_DIR = "contents";

type ArticleSummaryDictionary = {
  [articleId: string]: {[lang: string]: ArticleSummary }
}

const readSummaries = async () => {
  const dict = {} as ArticleSummaryDictionary;

  for (const dir of await readdir(CONTENTS_DIR, { withFileTypes: true })) {

    if (!dir.isDirectory()) { continue; }

    for (const file of await readdir(join(CONTENTS_DIR, dir.name))) {
      if (!file.endsWith(".summary.json")) { continue; }

      const data: ArticleSummary = JSON.parse(await readFile(join(CONTENTS_DIR, dir.name, file), "utf8"));

      if (!dict[data.articleId]) {
        dict[data.articleId] = {};
      }

      dict[data.articleId][data.lang] = data;
    }
  }

  return dict;

};

export const readSummariesCached = createDataSource({
  watchPath: CONTENTS_DIR,
  loader: readSummaries,
});

export async function getArticleSummary(article: { id: string; lang: string }) {

  const summaries = await readSummariesCached();

  // find related article items from article
  const articleSummaries = summaries[article.id];

  if (!articleSummaries) { return null; }

  // find the respect language
  const summary = articleSummaries[article.lang];

  if (!summary) { return null; }

  return summary;
}
