import "server-only";

import { globSync, readFileSync } from "node:fs";

interface ContentContext {
  (path: string): { default: string };
  keys(): string[];
}

declare const require: {
  context(directory: string, recursive: boolean, pattern: RegExp): ContentContext;
};

// A module context tracks edits, additions and deletions. Content is imported
// as raw text using the loader in next.config.ts, then parsed on the server.
const contents =
  process.env.NEXT_RUNTIME === "nodejs"
    ? require.context("../../contents", true, /\.(?:mdx?|summary\.json)$/)
    : undefined;

// Node scripts and integration tests run without a bundler; keep the content
// readers usable there too. Next replaces NEXT_RUNTIME at compile time.
export const contentPaths = (
  contents
    ? contents.keys().map((key) => `contents/${key.slice(2)}`)
    : globSync(["contents/**/*.md", "contents/**/*.mdx", "contents/**/*.summary.json"])
).sort();

export function readContentFile(path: string): string {
  return contents
    ? contents(`./${path.slice("contents/".length)}`).default
    : readFileSync(path, "utf-8");
}
