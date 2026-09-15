import { cleanEnv, str, url } from "envalid";
import OpenAI from "openai";

import { generatePrompt, removeThinkTags } from "./azureAi.js";
import type { Summarizer, SummaryResult } from "./index.js";

export const createOpenAiSummarizer = (): Summarizer => {
  const env = cleanEnv(process.env, {
    OPENAI_BASE_URL: url({
      desc: "OpenAI-compatible API base URL, including the version path",
      default: "https://api.openai.com/v1",
    }),
    OPENAI_API_KEY: str({ desc: "OpenAI-compatible API key" }),
    OPENAI_MODEL: str({ desc: "Model used to summarize articles" }),
    OPENAI_API_TYPE: str({
      desc: "API used to summarize articles",
      choices: ["chat-completions", "responses"],
      default: "chat-completions",
    }),
  });

  const client = new OpenAI({
    baseURL: env.OPENAI_BASE_URL,
    apiKey: env.OPENAI_API_KEY,
  });

  return {
    name: "openai",

    summarize: async (text: string, languageCode: string): Promise<SummaryResult[]> => {
      const language =
        languageCode === "cn" ? "Chinese" : languageCode === "en" ? "English" : languageCode;
      const messages: { role: "user"; content: string }[] = [
        { role: "user", content: generatePrompt(language) },
        { role: "user", content: text },
      ];
      const startTime = new Date().toISOString();

      let model: string;
      let summaries: string[];

      if (env.OPENAI_API_TYPE === "responses") {
        const response = await client.responses.create({
          model: env.OPENAI_MODEL,
          input: messages,
          store: false,
        });

        if (response.status !== "completed") {
          throw new Error(
            `OpenAI response ${response.status}: ${response.error?.message ?? response.incomplete_details?.reason ?? "summary did not complete"}`,
          );
        }

        model = response.model || env.OPENAI_MODEL;
        summaries = [removeThinkTags(response.output_text)];
      } else {
        const response = await client.chat.completions.create({
          model: env.OPENAI_MODEL,
          messages,
        });

        for (const choice of response.choices) {
          if (choice.finish_reason === "length" || choice.finish_reason === "content_filter") {
            throw new Error(`OpenAI completion stopped with ${choice.finish_reason}`);
          }
        }

        model = response.model || env.OPENAI_MODEL;
        summaries = response.choices.map((choice) => removeThinkTags(choice.message.content));
      }

      summaries = summaries.filter(Boolean);
      if (summaries.length === 0) {
        throw new Error("OpenAI returned no summary text");
      }

      return [
        {
          metadata: { summarizer: "openai", model },
          summaries,
          startTime,
          endTime: new Date().toISOString(),
        },
      ];
    },
  };
};
