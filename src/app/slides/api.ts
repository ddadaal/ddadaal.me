import { Octokit } from "@octokit/rest";
import { cache } from "react";

export interface Slide {
  name: string;
  html_url: string | null;
}

export const fetchSlides = cache(async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN, request: { fetch: fetch } });

  const resp = await octokit.rest.repos.getContent({ owner: "ddadaal", repo: "Slides", path: "" });

  if (!Array.isArray(resp.data)) {
    throw new Error("resp.data is not an array");
  }

  return resp.data
    .filter((x) => x.type === "dir")
    .map((x) => ({ html_url: x.html_url, name: x.name }) satisfies Slide);
});
