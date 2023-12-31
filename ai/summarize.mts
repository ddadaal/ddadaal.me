import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { AzureKeyCredential, TextAnalysisClient } from "@azure/ai-language-text";
import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";
import matter from "gray-matter";

dotenv.config({ path: ".env" });


const { positionals } = parseArgs({ allowPositionals: true });

const env = cleanEnv(process.env, {
  AZURE_LANGUAGE_ENDPOINT: str({ desc: "The endpoint for a Language model of the Azure Cognitive Service" }),
  AZURE_LANGUAGE_KEY: str({ desc: "The key for a Language model of the Azure Cognitive Service" }),
});

const client = new TextAnalysisClient(
  env.AZURE_LANGUAGE_ENDPOINT, new AzureKeyCredential(env.AZURE_LANGUAGE_KEY));

async function summarize(text: string, languageCode: string): Promise<string[] | Error> {
  const lro = await client.beginAnalyzeBatch([
    { kind: "AbstractiveSummarization" },
  ], [text], languageCode);

  const results = await lro.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "AbstractiveSummarization") {
      return new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      return new Error(`Unexpected error (${code}): ${message}`);
    }

    for (const result of actionResult.results) {
      if (result.error) {
        const { code, message } = result.error;
        return new Error(`Unexpected error (${code}): ${message}`);
      }

      return result.summaries.map((x) => x.text);
    }
  }

  throw new Error("No result");
}

const azureLanguageCodeMap = {
  cn: "zh-Hans",
  en: "en",
};

export interface ArticleSummary {
  articleId: string;
  lang: string;
  lastUpdateStartTime: string;
  lastUpdateEndTime: string;
  summaries: string[];
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

    console.log("Summarize %s of lang %s", frontMatter.id, frontMatter.lang);

    const startTime = new Date().toISOString();

    // summarize content
    const summary = await summarize(content,
      azureLanguageCodeMap[frontMatter.lang as keyof typeof azureLanguageCodeMap]);

    if (summary instanceof Error) {
      console.error("Error on summarizing %s of lang %s: %s", frontMatter.id, frontMatter.lang, summary.message);
      continue;
    }

    const summaryJson: ArticleSummary = {
      articleId: frontMatter.id,
      lang: frontMatter.lang,
      lastUpdateStartTime: startTime,
      lastUpdateEndTime: new Date().toISOString(),
      summaries: summary,
    };

    // write summary to json file
    const summaryJsonFilePath = join(articleDir, `${frontMatter.lang}.summary.json`);

    console.log("Write summary of %s of lang %s to %s", frontMatter.id, frontMatter.lang, summaryJsonFilePath);

    await writeFile(summaryJsonFilePath, JSON.stringify(summaryJson, null, 2));
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

main();


