import { createHash } from "node:crypto";
import { stat, writeFile } from "node:fs/promises";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";
import matter from "gray-matter";

import { createAzureAiSummarizer } from "./azureAi.mjs";
import { createAzureLanguageSummarier } from "./azureLanguage.mjs";
import { createOllamaSummarizer } from "./ollama.mjs";

dotenv.config({ path: ".env" });

const summarierMap = {
  "azure-language": createAzureLanguageSummarier,
  "azure-ai": createAzureAiSummarizer,
  "ollama": createOllamaSummarizer,
}

const env = cleanEnv(process.env, {
  SUMMARIZER: str({ desc: "The summarizer to use", choices: Object.keys(summarierMap) }),
})

const summarier = summarierMap[env.SUMMARIZER as keyof typeof summarierMap]();

export interface ArticleSummary {
  articleId: string;
  lang: string;
  lastUpdateStartTime: string;
  lastUpdateEndTime: string;
  summaries: string[];
  hash: string;
  mode: SummaryMode;
}

export type SummaryMode =
    | { mode: "azure-language" }
    | { mode: "azure-ai", model: string }
    | { mode: "ollama", model: string }

export interface SummarizationResult {
  summaries: string[];
  mode: SummaryMode;
}

export interface Summarizer {
  summarize(text: string, languageCode: string): Promise<SummarizationResult>;
}

const { positionals, values: { force } } = parseArgs({ allowPositionals: true, options: {
  force: { type: "boolean", alias: "f", description: "Force to summarize", default: true },
} });


function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

async function summarizeArticle(articleDir: string) {
  // get md files under the articleDir
  const mdFiles = (await readdir(articleDir)).filter((x) => x.endsWith(".md"));

  // parse each md files
  for (const mdFile of mdFiles) {

    // read md file
    const mdFilePath = join(articleDir, mdFile);
    const mdContent = await readFile(mdFilePath, "utf-8");

    // extract title and content
    const { data: frontMatter, content } = matter(mdContent);

    const log = (level: "log" | "error", msg: string, ...args: unknown[]) =>
      { console[level]("[%s %s] " + msg, frontMatter.id, frontMatter.lang, ...args); };

    const contentHash = hashContent(content);

    const summaryJsonFilePath = join(articleDir, `${frontMatter.lang as string}.summary.json`);

    if (force) {
      log("log", "Force to summarize %s of lang %s", frontMatter.id, frontMatter.lang);
    } else if (await stat(summaryJsonFilePath).then((x) => x.isFile()).catch(() => false)) {
      const existingSummaryJson = JSON.parse(await readFile(summaryJsonFilePath, "utf-8")) as ArticleSummary;

      existingSummaryJson.hash = contentHash;

      if (contentHash === existingSummaryJson.hash) {
        log("log", "Content is not changed after the last summarization. Skip summarization.");
        continue;
      }
    }

    log("log", "Summarize %s of lang %s", frontMatter.id, frontMatter.lang);


    const startTime = new Date();
    // summarize content
    try {

      const summaries = await summarier.summarize(content, frontMatter.lang as string);

      const endTime = new Date();

      const summaryJson: ArticleSummary = {
        articleId: frontMatter.id as string,
        lang: frontMatter.lang as string,
        lastUpdateStartTime: startTime.toISOString(),
        lastUpdateEndTime: endTime.toISOString(),
        summaries: summaries.summaries,
        hash: contentHash,
        mode: summaries.mode,
      };

      log("log", "Write summary of %s of lang %s to %s. Took %d seconds",
        frontMatter.id, frontMatter.lang, summaryJsonFilePath, (endTime.getTime() - startTime.getTime()) / 1000);

      await writeFile(summaryJsonFilePath, JSON.stringify(summaryJson, null, 2));
    } catch (e) {
      log("error", "Failed to summarize %s of lang %s. %s", frontMatter.id, frontMatter.lang, e);
    }
  }
}

async function main() {

  const CONTENT_DIR = "../contents";

  let dirs = positionals;

  if (positionals.length === 0) {
    console.log("No positional arguments. Summarize all articles");
    dirs = (await readdir(CONTENT_DIR, { withFileTypes: true }))
      .filter((x) => x.isDirectory() && /^([0-9]{8})-/.test(x.name))
      .map((x) => x.name);
  }

  for (const dir of dirs) {
    if (!(/^([0-9]{8})-/.test(dir))) {
      continue;
    }

    await summarizeArticle(join(CONTENT_DIR, dir));
  }
}

void main();


