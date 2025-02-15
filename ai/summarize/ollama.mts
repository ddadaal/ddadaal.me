import { cleanEnv, str } from "envalid"
import { Ollama } from "ollama";

import { removeThinkTags } from "./azureAi.mjs";
import { Summarizer, SummaryResult } from "./index.mjs";

const generatePrompt = (languageCode: string, text: string) =>
  `用100字以内的纯文本（不要包含markdown样式）总结下面这篇文章，用${languageCode}语言: \n\n${text}`

export const createOllamaSummarizer = (): Summarizer => {
  const env = cleanEnv(process.env, {
    OLLAMA_LOCAL_ENDPOINT: str({ desc: "Local Ollama service endpoint" }),
    OLLAMA_LOCAL_MODEL: str({ desc: "Local Ollama model" }),
  });


  return {
    name: "ollama",
    summarize: async (text: string, languageCode: string): Promise<SummaryResult[]> => {

      const prompt = generatePrompt(languageCode, text);

      const ollama = new Ollama({
        host: env.OLLAMA_LOCAL_ENDPOINT,
      });

      const startTime = new Date().toISOString();

      const response = await ollama.chat({
        model: env.OLLAMA_LOCAL_MODEL,
        stream: false,
        messages: [
          { role: "user", content: prompt },
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
      } else {
        throw new Error("Unexpected response: " + response.message.content);
      }
    }
  }
}
