import Link from "next/link";
import { HeadingWithLink } from "src/components/article/ArticleContent";
import { Localized } from "src/i18n";

import { ArticleSummary } from "../../../ai/summarize.mjs";

interface Props {
  summary: ArticleSummary;
}

// eslint-disable-next-line max-len
const AZURE_AI_LANGUAGE_SERVICE_DOC_URL = "https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization";

export const ArticleSummarization = ({ summary }: Props) => {


  return (
    <div className="p-4 my-4 bg-neutral rounded shadow">
      <HeadingWithLink
        element="h1"
        props={{
          id: "summary",
          children: (
            <Localized id="articlePage.summary.title" />
          ),
        }}
      />
      {summary.summaries.map((x, i) => (
        <p className="text-neutral-content" key={i}>
          {x}
        </p>
      ))}
      <p className="text-sm justify-end flex">
        <Localized
          id="articlePage.summary.poweredBy"
          args={[
            <Link target="_blank" key="docUrl" href={AZURE_AI_LANGUAGE_SERVICE_DOC_URL}>
              Azure AI Language Service
            </Link>,
          ]}
        />
      </p>
    </div>
  );


};
