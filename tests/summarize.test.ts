import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test, type TestContext } from "node:test";
import { promisify } from "node:util";

import type { ArticleSummary } from "../tools/summarize/index.js";
import { createOpenAiSummarizer } from "../tools/summarize/openai.js";

const execFileAsync = promisify(execFile);

async function startApi(t: TestContext, response: unknown, statusCode = 200) {
  const requests: {
    url: string | undefined;
    method: string | undefined;
    authorization: string | undefined;
    body: Record<string, unknown>;
  }[] = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({
      url: req.url,
      method: req.method,
      authorization: req.headers.authorization,
      body: JSON.parse(body),
    });
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(async () => {
    server.closeAllConnections();
    await server[Symbol.asyncDispose]();
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return { baseURL: `http://127.0.0.1:${address.port}/custom/v1`, requests };
}

function configure(t: TestContext, baseURL: string, apiType?: string) {
  const values = {
    OPENAI_BASE_URL: baseURL,
    OPENAI_API_KEY: "test-api-key",
    OPENAI_MODEL: "requested-model",
    OPENAI_API_TYPE: apiType,
  };
  for (const [key, value] of Object.entries(values)) {
    const previous = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }
}

const chatResponse = {
  id: "chatcmpl-test",
  object: "chat.completion",
  created: 1,
  model: "returned-model",
  choices: [
    {
      index: 0,
      finish_reason: "stop",
      message: { role: "assistant", content: "<think>Private reasoning\n</think> 文章摘要。 " },
    },
  ],
};

const responsesResponse = {
  id: "resp-test",
  object: "response",
  status: "completed",
  model: "returned-model",
  output: [
    { type: "reasoning", id: "reasoning-test", summary: [] },
    {
      type: "message",
      id: "message-test",
      role: "assistant",
      status: "completed",
      content: [
        { type: "output_text", text: "First sentence. ", annotations: [] },
        { type: "output_text", text: "Second sentence.", annotations: [] },
      ],
    },
  ],
};

void test("Chat Completions uses the custom base URL, Bearer key, model and article language", async (t) => {
  const api = await startApi(t, chatResponse);
  configure(t, api.baseURL);
  const [result] = await createOpenAiSummarizer().summarize("中文文章正文", "cn");

  assert.equal(api.requests.length, 1);
  const [request] = api.requests;
  assert.equal(request.url, "/custom/v1/chat/completions");
  assert.equal(request.method, "POST");
  assert.equal(request.authorization, "Bearer test-api-key");
  assert.equal(request.body.model, "requested-model");
  const messages = request.body.messages as { role: string; content: string }[];
  assert.match(messages[0].content, /Chinese/);
  assert.deepEqual(messages[1], { role: "user", content: "中文文章正文" });
  assert.deepEqual(result.metadata, { summarizer: "openai", model: "returned-model" });
  assert.deepEqual(result.summaries, ["文章摘要。"]);
  assert.ok(Date.parse(result.endTime) >= Date.parse(result.startTime));
});

void test("Responses uses input messages and joins output text after reasoning items", async (t) => {
  const api = await startApi(t, responsesResponse);
  configure(t, `${api.baseURL}/`, "responses");
  const [result] = await createOpenAiSummarizer().summarize("English article", "en");

  assert.equal(api.requests.length, 1);
  const [request] = api.requests;
  assert.equal(request.url, "/custom/v1/responses");
  assert.equal(request.authorization, "Bearer test-api-key");
  assert.equal(request.body.model, "requested-model");
  assert.equal(request.body.store, false);
  assert.equal(request.body.messages, undefined);
  const input = request.body.input as { role: string; content: string }[];
  assert.match(input[0].content, /English/);
  assert.deepEqual(input[1], { role: "user", content: "English article" });
  assert.deepEqual(result.summaries, ["First sentence. Second sentence."]);
  assert.deepEqual(result.metadata, { summarizer: "openai", model: "returned-model" });
});

for (const scenario of [
  {
    name: "API authentication errors",
    apiType: "chat-completions",
    status: 401,
    response: { error: { message: "Invalid API key", type: "authentication_error" } },
    error: /401.*Invalid API key/,
  },
  {
    name: "empty Chat Completions output",
    apiType: "chat-completions",
    response: { ...chatResponse, choices: [] },
    error: /no summary text/,
  },
  {
    name: "truncated Chat Completions output",
    apiType: "chat-completions",
    response: {
      ...chatResponse,
      choices: [{ ...chatResponse.choices[0], finish_reason: "length" }],
    },
    error: /stopped with length/,
  },
  {
    name: "incomplete Responses output",
    apiType: "responses",
    response: {
      ...responsesResponse,
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
    },
    error: /incomplete.*max_output_tokens/,
  },
  {
    name: "Responses refusals",
    apiType: "responses",
    response: {
      ...responsesResponse,
      output: [{ type: "message", content: [{ type: "refusal", refusal: "Cannot summarize" }] }],
    },
    error: /no summary text/,
  },
]) {
  void test(`rejects ${scenario.name}`, async (t) => {
    const api = await startApi(t, scenario.response, scenario.status);
    configure(t, api.baseURL, scenario.apiType);
    await assert.rejects(createOpenAiSummarizer().summarize("Article", "en"), scenario.error);
  });
}

void test("CLI loads .env, saves summaries, skips unchanged articles and replaces forced results", async (t) => {
  const api = await startApi(t, chatResponse);
  const cwd = await mkdtemp(join(tmpdir(), "summarize-test-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const articleDir = "20260913-test-article";
  const directory = join(cwd, "contents", articleDir);
  await mkdir(directory, { recursive: true });
  const content = "\n文章正文。\n";
  await writeFile(
    join(directory, "cn.md"),
    `---\nid: test-article\nlang: cn\ntitle: Test\n---\n${content}`,
  );
  await writeFile(
    join(cwd, ".env"),
    [
      "ENABLED_SUMMARIZERS=openai",
      `OPENAI_BASE_URL=${api.baseURL}`,
      "OPENAI_API_KEY=test-api-key",
      "OPENAI_MODEL=requested-model",
      "OPENAI_API_TYPE=chat-completions",
    ].join("\n"),
  );

  const env = { ...process.env };
  for (const key of [
    "ENABLED_SUMMARIZERS",
    "OPENAI_BASE_URL",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "OPENAI_API_TYPE",
  ]) {
    delete env[key];
  }
  const run = (...args: string[]) =>
    execFileAsync(
      process.execPath,
      [
        "--import",
        require.resolve("tsx"),
        resolve("tools/summarize/index.ts"),
        articleDir,
        ...args,
      ],
      { cwd, env, timeout: 30_000 },
    );
  const outputPath = join(directory, "cn.summary.json");
  const readSummary = async (): Promise<ArticleSummary> =>
    JSON.parse(await readFile(outputPath, "utf-8"));

  await run();
  const first = await readSummary();
  assert.equal(first.articleId, "test-article");
  assert.equal(first.lang, "cn");
  assert.equal(first.hash, createHash("sha256").update(content).digest("hex"));
  assert.equal(first.summaries.length, 1);
  assert.deepEqual(first.summaries[0].summaries, ["文章摘要。"]);
  assert.equal(api.requests.length, 1);

  await run();
  assert.equal(api.requests.length, 1);
  assert.deepEqual(await readSummary(), first);

  const existingProvider = {
    ...first.summaries[0],
    metadata: { summarizer: "ollama", model: "local-model" },
  };
  await writeFile(
    outputPath,
    JSON.stringify({ ...first, summaries: [existingProvider, ...first.summaries] }),
  );
  for (const force of ["--force", "-f"]) {
    await run(force);
    const updated = await readSummary();
    assert.deepEqual(
      updated.summaries.map((summary) => summary.metadata.summarizer),
      ["openai", "ollama"],
    );
    assert.deepEqual(updated.summaries[1], existingProvider);
    assert.doesNotMatch(JSON.stringify(updated), /test-api-key|127\.0\.0\.1/);
  }
  assert.equal(api.requests.length, 3);
});
