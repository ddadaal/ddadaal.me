import { AzureKeyCredential } from "@azure/ai-language-text";
import createModelClient, { GetChatCompletions200Response } from "@azure-rest/ai-inference";
import { cleanEnv, str } from "envalid";

import { SummarizationResult, Summarizer } from "./index.mjs";

export const generatePrompt = (languageCode: string) =>
  `Summarize the article in the next message in language ${languageCode} in 100 words. Return the result in plain text format, without any other information.`

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
    summarize: async (text: string, languageCode: string): Promise<SummarizationResult> => {

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

      const postProcess = (x: string | null) => {
        // remove everything between <think> and </think>, including line breaks
        return x ? x.replace(/<think>[\s\S]*?<\/think>/g, "").trim() : "";
      }

      if (responseOk(response)) {
        return {
          summaries: response.body.choices.map((x) => postProcess(x.message.content)),
          mode: { mode: "azure-ai", model: response.body.model },
        };
      } else {
        throw new Error(`Unexpected response: ${response.status}. message: ${JSON.stringify(response.body)}`);
      }
    }
  }
}
