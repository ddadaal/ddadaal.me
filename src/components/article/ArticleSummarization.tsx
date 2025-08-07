"use client";

import classNames from "classnames";
import Link from "next/link";
import { JSX, useState } from "react";
import { HeadingWithLink } from "src/components/article/Components";
import { Localized } from "src/i18n";

import { SummarizerMetadata } from "../../../tools/summarize/index.js";

interface Summary {
  metadata: SummarizerMetadata;
  children: JSX.Element;
}

interface Props {
  summaries: Summary[];
}

const AZURE_AI_LANGUAGE_SERVICE_DOC_URL = "https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization";
const AZURE_AI_URL = "https://ai.azure.com";

const modelNameMap: Record<string, string> = {
  // Value cannot contain spaces, otherwise the tab text will be line breaked
  "deepseek-r1:8b": "DeepSeek R1 8B",
  "DeepSeek-R1": "DeepSeek R1",
  "llamafamily/llama3-chinese-8b-instruct": "Llama3 Chinese 8B Instruct",
};

export const ArticleSummarization = ({ summaries }: Props) => {
  const [index, setIndex] = useState(0);

  const selected = summaries[index];

  return (
    <div className="card card-l my-2 shadow">
      <div className="card-body">
        <HeadingWithLink
          element="h1"
          anchorLinkClassName="card-title"
          props={{
            id: "summary",
            className: "mb-3",
            children: (
              <Localized key="summaryTitle" id="articlePage.summary.title" />
            ),
          }}
        />
        <div>
          <div role="tablist" className="tabs-boxed">
            {
              summaries.map((x, i) => (
                <a role="tab" className={classNames("tab", "no-underline", index === i ? "tab-active" : "", "")} key={i} onClick={() => { setIndex(i); }}>
                  {x.metadata.model ? modelNameMap[x.metadata.model] ?? x.metadata.model : x.metadata.summarizer}
                </a>
              ))
            }
            <div role="tabpanel" className="p-3">
              <div className="prose max-h-80 overflow-auto max-w-full prose-p:m-0 prose-li:m-0 prose-ul:m-0 prose-ol:m-0">
                {selected.children}
              </div>

              <p className="text-sm justify-end flex m-2 italic">
                {
                  selected.metadata.summarizer === "azure-ai"
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
                            selected.metadata.model,
                          ]}
                        />
                      )
                    : selected.metadata.summarizer === "azure-language"
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
                              selected.metadata.model,
                            ]}
                          />
                        )
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
