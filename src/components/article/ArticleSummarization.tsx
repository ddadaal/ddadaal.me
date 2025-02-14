import Link from "next/link";
import { HeadingWithLink } from "src/components/article/ArticleContent";
import { Localized } from "src/i18n";

import { ArticleSummary } from "../../../ai/summarize/index.mjs";

interface Props {
  summary: ArticleSummary;
}

const AZURE_AI_LANGUAGE_SERVICE_DOC_URL = "https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization";
const AZURE_AI_URL = "https://ai.azure.com";

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
      {summary.summaries.map((x, i) => (
        <p className="text-neutral-content" key={i}>
          {x}
        </p>
      ))}
      <p className="text-sm justify-end flex text-neutral-content">
        {
          summary.mode.mode === "azure-ai"
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
                    summary.mode.model,
                  ]}
                />
              )
            : (
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
        }
      </p>
    </div>
  );
};
