
import { AzureKeyCredential, TextAnalysisClient } from "@azure/ai-language-text";
import { cleanEnv, str } from "envalid";

import { Summarizer, SummaryResult } from "./index.mjs";

const azureLanguageCodeMap = {
  cn: "zh-Hans",
  en: "en",
};

export const createAzureLanguageSummarier = () : Summarizer => {

  const env = cleanEnv(process.env, {
    AZURE_LANGUAGE_ENDPOINT: str({ desc: "The endpoint for a Language model of the Azure Cognitive Service" }),
    AZURE_LANGUAGE_KEY: str({ desc: "The key for a Language model of the Azure Cognitive Service" }),
  });

    const client = new TextAnalysisClient(
      env.AZURE_LANGUAGE_ENDPOINT, new AzureKeyCredential(env.AZURE_LANGUAGE_KEY));

      return {
        name: "azureLanguage",

        summarize: async (text: string, languageCode: string): Promise<SummaryResult[]> => {

          const mappedLanguageCode = azureLanguageCodeMap[languageCode as keyof typeof azureLanguageCodeMap];

          const startTime = new Date().toISOString();

          const lro = await client.beginAnalyzeBatch([
            { kind: "AbstractiveSummarization" },
          ], [text], mappedLanguageCode);

          const results = await lro.pollUntilDone();

          for await (const actionResult of results) {
            if (actionResult.kind !== "AbstractiveSummarization") {
              throw new Error(`Expected abstractive summarization results but got: ${actionResult.kind}`);
            }
            if (actionResult.error) {
              const { code, message } = actionResult.error;
              throw new Error(`Unexpected error (${code}): ${message}`);
            }

            for (const result of actionResult.results) {
              if (result.error) {
                const { code, message } = result.error;
                throw new Error(`Unexpected error (${code}): ${message}`);
              }

              const endTime = new Date().toISOString();

              return [{
                metadata: { summarizer: "azure-language" },
                summaries: result.summaries.map((x) => x.text),
                endTime,
                startTime,
              }];
            }
          }

          throw new Error("No result");
    }
  }
}


