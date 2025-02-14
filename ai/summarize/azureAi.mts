import { AzureKeyCredential } from "@azure/ai-language-text";
import createModelClient, { GetChatCompletions200Response } from "@azure-rest/ai-inference";
import { cleanEnv, str } from "envalid";

import { Summarizer, SummaryData } from "./index.mjs";

export const generatePrompt = (languageCode: string) =>
  `Summarize the article in the next message in language ${languageCode} in 100 words. Return the result in plain text format, without any other information.`

export const removeThinkTags = (x: string | null) => {
  // remove everything between <think> and </think>, including line breaks
  return x ? x.replace(/<think>[\s\S]*?<\/think>/g, "").trim() : "";
}

export const createAzureAiSummarizer = () : Summarizer => {

  const env = cleanEnv(process.env, {
    AZURE_AI_ENDPOINT: str({ desc: "Azure AI service endpoint" }),
    AZURE_AI_DEPLOYMENT_NAME: str({ desc: "Azure AI model deployment name" }),
    AZURE_AI_KEY: str({ desc: "Azure AI service key" }),
  });

  const client = createModelClient(
    env.AZURE_AI_ENDPOINT,
    new AzureKeyCredential(env.AZURE_AI_KEY),
  );

  return {
    name: "azure-ai",

    summarize: async (text: string, languageCode: string): Promise<SummaryData> => {

      const messages = [
        { role: "user", content: generatePrompt(languageCode) },
        { role: "user", content: text },
      ];

      const response = await client.path("/chat/completions").post({
          body: {
            messages: messages,
            model: env.AZURE_AI_DEPLOYMENT_NAME,
          }
      });

      function responseOk(res: typeof response): res is GetChatCompletions200Response {
        return res.status === "200";
      }


      if (responseOk(response)) {
        return {
          summaries: response.body.choices.map((x) => removeThinkTags(x.message.content)),
          metadata: { summarizer: "azure-ai", model: response.body.model },
        };
      } else {
        throw new Error(`Unexpected response: ${response.status}. message: ${JSON.stringify(response.body)}`);
      }
    }
  }
}
