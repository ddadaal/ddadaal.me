import { cleanEnv, str } from "envalid"
import { Ollama } from "ollama";

import { removeThinkTags } from "./azureAi.mjs";
import { Summarizer, SummaryData } from "./index.mjs";

const generatePrompt = (languageCode: string, text: string) =>
  `Summarize the article in the next message in language ${languageCode}. Return must be plain text. Don't include any markdown things!! And it must contain less than 100 words or characters.\n${text}`

export const createOllamaSummarizer = (): Summarizer => {
  const env = cleanEnv(process.env, {
    OLLAMA_LOCAL_ENDPOINT: str({ desc: "Local Ollama service endpoint" }),
    OLLAMA_LOCAL_MODEL: str({ desc: "Local Ollama model" }),
  });

  const ollama = new Ollama({
    host: env.OLLAMA_LOCAL_ENDPOINT,
  });

  return {
    name: "ollama",
    summarize: async (text: string, languageCode: string): Promise<SummaryData> => {

      const prompt = generatePrompt(languageCode, text);

      const response = await ollama.chat({
        model: env.OLLAMA_LOCAL_MODEL,
        stream: false,
        messages: [
          { role: "user", content: prompt },
        ],
      })

      if (response.done) {
        return {
          summaries: [removeThinkTags(response.message.content)],
          metadata: { summarizer: "ollama", model: response.model },
        }
      } else {
        throw new Error("Unexpected response: " + response.message.content);
      }
    }
  }
}
