# Article summaries

Run these commands from the project root after `pnpm install`. The CLI reads the
root `.env` file; it does not automatically load `.env.local`. Existing process
environment variables take precedence.

## OpenAI-compatible services

Merge the entries in [`.env.example`](.env.example) into the root `.env` and set
your service's API key and model:

```dotenv
ENABLED_SUMMARIZERS=openai
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=replace-me
OPENAI_MODEL=your-model-name
OPENAI_API_TYPE=chat-completions
```

| Variable          | Meaning                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_BASE_URL` | API base URL, including its version path. Defaults to `https://api.openai.com/v1`. Custom OpenAI-compatible services are supported. |
| `OPENAI_API_KEY`  | Required API key, sent as a Bearer token.                                                                                           |
| `OPENAI_MODEL`    | Required model ID accepted by the service.                                                                                          |
| `OPENAI_API_TYPE` | `chat-completions` (default) calls `/chat/completions`; `responses` calls `/responses`.                                             |

Do not append `/chat/completions` or `/responses` to `OPENAI_BASE_URL`. The selected
service and model must support the chosen API. Responses requests set `store=false`.
The `openai` summarizer uses non-streaming text generation for both APIs; it does
not use the legacy `/completions` endpoint.

```bash
# Summarize one article (pass the directory name without the contents/ prefix).
pnpm summarize 20260913-how-i-cannot-get-mainstream-job

# Regenerate an existing summary, including after changing the service or model.
pnpm summarize 20260913-how-i-cannot-get-mainstream-job --force

# Scan all article directories beginning with YYYYMMDD-.
pnpm summarize

# Run the protocol and CLI tests against a local mock API.
pnpm test:summarize
```

You can pass multiple directory names separated by spaces. Each `.md` file in an
article directory is summarized using its frontmatter `lang` (`cn` or `en`).
Results are written beside the article as `<lang>.summary.json`, with the model
name, timestamps, and a hash of the Markdown body. API addresses and keys are not
included in the summary file.

If the body hash is unchanged, the CLI skips the article. Use `--force` (or `-f`)
when switching models or adding a provider to an already summarized article.
Regeneration replaces the existing `openai` result and preserves summaries from
other providers. OpenAI summaries appear first in the saved provider order.
Empty, refused, or incomplete generations are treated as failures rather than
saved as summaries. Failures are logged and the CLI continues to the next
provider or article, so check the logs and output files as well as the exit code.

The website automatically reads the summary JSON. Production content updates
require a new build and deployment.

## Other providers

`ENABLED_SUMMARIZERS` accepts multiple comma-separated names without spaces,
for example `openai,ollama`. Configure every enabled provider:

| Provider         | Required variables                                                           |
| ---------------- | ---------------------------------------------------------------------------- |
| `azure-ai`       | `AZURE_AI_ENDPOINT`, `AZURE_AI_KEY`, `AZURE_AI_DEPLOYMENT_NAME`              |
| `azure-language` | `AZURE_LANGUAGE_ENDPOINT`, `AZURE_LANGUAGE_KEY`                              |
| `ollama`         | `OLLAMA_LOCAL_ENDPOINT`, `OLLAMA_LOCAL_MODELS` (comma-separated model names) |
