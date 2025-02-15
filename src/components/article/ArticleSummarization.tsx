import Link from "next/link";
import { JSX } from "react";
import * as prod from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { HeadingWithLink } from "src/components/article/ArticleContent";
import { Localized } from "src/i18n";
import { unified } from "unified";

import { ArticleSummary } from "../../../tools/summarize/index.js";

interface Props {
  summary: ArticleSummary;
}

const AZURE_AI_LANGUAGE_SERVICE_DOC_URL = "https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization";
const AZURE_AI_URL = "https://ai.azure.com";

const modelNameMap: Record<string, string> = {
  // Value cannot contain spaces, otherwise the tab text will be line breaked
  "deepseek-r1:8b": "DeepSeek_R1_8B",
  "DeepSeek-R1": "DeepSeek_R1",
  "llamafamily/llama3-chinese-8b-instruct": "Llama3_Chinese_8B_Instruct",
};

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

async function parseMarkdown(content: string) {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeReact, {
      ...production,
    })
    .process(content);

  return file.result as JSX.Element;

  /* eslint-enable @typescript-eslint/no-unsafe-call */
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  /* eslint-enabel @typescript-eslint/no-unsafe-assignment */
}

export const ArticleSummarization = async ({ summary }: Props) => {
  return (
    <div className="p-4 my-4 bg-neutral rounded shadow">
      <HeadingWithLink
        element="h1"
        anchorLinkClassName="text-neutral-content"
        props={{
          id: "summary",
          className: "text-neutral-content",
          children: (
            <Localized key="summaryTitle" id="articlePage.summary.title" />
          ),
        }}
      />
      <div>
        <div role="tablist" className="tabs tabs-boxed">
          {await Promise.all(summary.summaries.map(async (x, i) => (
            <>
              <input
                type="radio"
                name="summaryTab"
                role="tab"
                className="tab text-base-content"
                id={`summaryTab-${String(i)}`}
                aria-label={x.metadata.model ? modelNameMap[x.metadata.model] ?? x.metadata.model : x.metadata.summarizer}
                defaultChecked={i === 0}
              />
              <div
                key={i}
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
              >
                <div className="prose max-w-full prose-p:m-0 prose-li:m-0 prose-ul:m-0 prose-ol:m-0">
                  {await parseMarkdown(x.summaries.join("\n\n"))}
                </div>

                {/* {
                  x.summaries.map((c, i) => (
                    <p className="p-1" key={i}>
                      {c}
                    </p>
                  ))
                } */}
                <p className="text-sm justify-end flex p-1">
                  {
                    x.metadata.summarizer === "azure-ai"
                      ? (
                          <Localized
                            id="articlePage.summary.poweredBy.azureAi"
                            args={[
                              <Link
                                target="_blank"
                                key="azureAiUrl"
                                href={AZURE_AI_URL}
                              >
                                Azure AI
                              </Link>,
                              x.metadata.model,
                            ]}
                          />
                        )
                      : x.metadata.summarizer === "azure-language"
                        ? (
                            <Localized
                              id="articlePage.summary.poweredBy.azureLanguage"
                              args={[
                                <Link
                                  target="_blank"
                                  key="docUrl"
                                  href={AZURE_AI_LANGUAGE_SERVICE_DOC_URL}
                                >
                                  Azure AI Language Service
                                </Link>,
                              ]}
                            />
                          )
                        : (
                            <Localized
                              id="articlePage.summary.poweredBy.ollama"
                              args={[
                                <Link
                                  target="_blank"
                                  key="ollamaUrl"
                                  href="https://ollama.com/"
                                >
                                  Ollama
                                </Link>,
                                x.metadata.model,
                              ]}
                            />
                          )
                  }
                </p>
              </div>
            </>
          )))}
        </div>
      </div>
    </div>
  );
};
