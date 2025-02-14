import Link from "next/link";
import { HeadingWithLink } from "src/components/article/ArticleContent";
import { Localized } from "src/i18n";

import { ArticleSummary } from "../../../ai/summarize/index.mjs";

interface Props {
  summary: ArticleSummary;
}

const AZURE_AI_LANGUAGE_SERVICE_DOC_URL = "https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization";
const AZURE_AI_URL = "https://ai.azure.com";

const modelNameMap: Record<string, string> = {
  // Value cannot contain spaces, otherwise the tab text will be line breaked
  "deepseek-r1:7b": "DeepSeek_R1_7B",
  "DeepSeek-R1": "DeepSeek_R1",
};

export const ArticleSummarization = ({ summary }: Props) => {
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
        <div role="tablist" className="tabs tabs-lifted">
          {summary.summaries.map((x, i) => (
            <>
              <input
                type="radio"
                name="summaryTab"
                role="tab"
                className="tab w-auto"
                aria-label={x.metadata.model ? modelNameMap[x.metadata.model] ?? x.metadata.model : x.metadata.summarizer}
                defaultChecked={i === 0}
              />
              <div
                key={i}
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
              >
                {
                  x.summaries.map((c, i) => (
                    <p className="text-neutral-content p-1" key={i}>
                      {c}
                    </p>
                  ))
                }
                <p className="text-sm justify-end flex text-neutral-content p-1">
                  {
                    x.metadata.summarizer === "azure-ai"
                      ? (
                          <Localized
                            id="articlePage.summary.poweredBy.azureAi"
                            args={[
                              <Link
                                target="_blank"
                                key="azureAiUrl"
                                className="text-neutral-content"
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
                                  className="text-neutral-content"
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
                                  className="text-neutral-content"
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
          ))}
        </div>
      </div>
    </div>
  );
};
