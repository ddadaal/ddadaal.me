import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
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

const summarierMap: Record<string, (() => Summarizer) | undefined> = {
  "azure-language": createAzureLanguageSummarier,
  "azure-ai": createAzureAiSummarizer,
  "ollama": createOllamaSummarizer,
}

const env = cleanEnv(process.env, {
  ENABLED_SUMMARIZERS: str({
    desc: "The summarizers to use, separated by ,. Available values: " + Object.keys(summarierMap).join(",") }),
})

const summarizers  = env.ENABLED_SUMMARIZERS.split(",")
  .filter((x) => x.trim())
  .map((x) => {
    const constructor: (() => Summarizer) | undefined = summarierMap[x];

    if (!constructor) {
      throw new Error(`Unknown summarizer: ${x}. Available values: ${Object.keys(summarierMap).join(",")}`);
    }

    return constructor();
  });

export interface ArticleSummary {
  articleId: string;
  lang: string;
  hash: string;
  summaries: SummaryData[];
}

export interface SummaryData {
  metadata: SummarizerMetadata;
  summaries: string[];
}

export type SummarizerMetadata =
    | { summarizer: "azure-language" }
    | { summarizer: "azure-ai", model: string }
    | { summarizer: "ollama", model: string }

export interface Summarizer {
  readonly name: string;
  summarize(text: string, languageCode: string): Promise<SummaryData>;
}

const { positionals, values: { force } } = parseArgs({ allowPositionals: true, options: {
  force: { type: "boolean", alias: "f", description: "Force to summarize", default: false },
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

    const existingFileContent = await readFile(summaryJsonFilePath, "utf-8").catch(() => null);

    const summaryFile: ArticleSummary | null = existingFileContent ? JSON.parse(existingFileContent) as ArticleSummary : {
      articleId: frontMatter.id as string,
      lang: frontMatter.lang as string,
      hash: contentHash,
      summaries: [],
    }

    for (const summarizer of summarizers) {

      const existingSummary = summaryFile.summaries.find((x) => x.metadata.summarizer === summarizer.name);

      if (existingSummary && !force && contentHash === summaryFile.hash) {
        log("log", "Artile content is not changed after last summarization, --force is not set, and summary of %s of lang %s using %s is already done. Skip summarization of summarizer %s",
          frontMatter.id, frontMatter.lang, summarizer.name, summarizer.name);

        continue;
      }

      log("log", "Summarize %s of lang %s using %s", frontMatter.id, frontMatter.lang, summarizer.name);

      const startTime = new Date();
      // summarize content
      try {

        const data = await summarizer.summarize(content, frontMatter.lang as string);

        const endTime = new Date();

        if (existingSummary) {
          existingSummary.metadata = data.metadata;
          existingSummary.summaries = data.summaries;
        } else {
          summaryFile.summaries.push({
            metadata: data.metadata,
            summaries: data.summaries,
          });
        };

        log("log", "Summary of %s of lang %s using %s complete. Took %d seconds",
          frontMatter.id, frontMatter.lang, summarizer.name, (endTime.getTime() - startTime.getTime()) / 1000);

      } catch (e) {
        log("error", "Failed to summarize %s of lang %s using %s. %s", frontMatter.id, frontMatter.lang, summarizer.name, e);
        continue;
      }

      log("log", "Write summary json to %s", summaryJsonFilePath);
      await writeFile(summaryJsonFilePath, JSON.stringify(summaryFile, null, 2));
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
