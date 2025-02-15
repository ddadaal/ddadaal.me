import { cleanEnv, str } from "envalid";
import { Ollama } from "ollama";

import { removeThinkTags } from "./azureAi.js";
import { Summarizer, SummaryResult } from "./index.js";

const generatePrompt = (languageCode: string) =>
  `在100字以内总结下面这篇文章，用${languageCode}语言，不要包含markdown，直接返回结果`;

export const createOllamaSummarizer = (): Summarizer => {
  const env = cleanEnv(process.env, {
    OLLAMA_LOCAL_ENDPOINT: str({ desc: "Local Ollama service endpoint" }),
    OLLAMA_LOCAL_MODEL: str({ desc: "Local Ollama model" }),
  });

  return {
    name: "ollama",
    summarize: async (text: string, languageCode: string): Promise<SummaryResult[]> => {
      const prompt = generatePrompt(languageCode);

      const ollama = new Ollama({
        host: env.OLLAMA_LOCAL_ENDPOINT,
      });

      const startTime = new Date().toISOString();

      const response = await ollama.chat({
        model: env.OLLAMA_LOCAL_MODEL,
        stream: false,
        messages: [
          { role: "user", content: prompt },
          { role: "user", content: text },
        ],
      });

      const endTime = new Date().toISOString();

      if (response.done) {
        return [{
          summaries: [removeThinkTags(response.message.content)],
          metadata: { summarizer: "ollama", model: response.model },
          endTime,
          startTime,
        }];
      }
      else {
        throw new Error("Unexpected response: " + response.message.content);
      }
    },
  };
};
