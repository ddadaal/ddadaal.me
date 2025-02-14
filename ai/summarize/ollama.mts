import { cleanEnv, str } from "envalid"
import { Ollama } from "ollama";

import { generatePrompt } from "./azureAi.mjs";
import { SummarizationResult } from "./index.mjs";

export const createOllamaSummarizer = () => {
  const env = cleanEnv(process.env, {
    OLLAMA_LOCAL_ENDPOINT: str({ desc: "Local Ollama service endpoint" }),
    OLLAMA_LOCAL_MODEL: str({ desc: "Local Ollama model" }),
  });

  const ollama = new Ollama({
    host: env.OLLAMA_LOCAL_ENDPOINT,
  });

  return {
    summarize: async (text: string, languageCode: string): Promise<SummarizationResult> => {

      const prompt = generatePrompt(languageCode);

      const response = await ollama.chat({
        model: env.OLLAMA_LOCAL_ENDPOINT,
        messages: [
          { role: "user", content: prompt },
          { role: "user", content: text },
        ],
      })

      if (response.done) {
        return {
          summaries: [response.model],
          mode: { mode: "ollama", model: response.model, },
        }
      } else {
        throw new Error("Unexpected response: " + response.message.content);
      }
    }
  }
}
