export interface GithubComment {
  id: number;
  body: string;
  body_html?: string;
  created_at: string;
  user: { login: string; avatar_url: string; html_url: string } | null;
}

export interface GithubIssue {
  number: number;
  html_url: string;
  comments: number;
  reactions?: {
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
}

export const owner = "ddadaal";
export const repo = "ddadaal.me.github.io";
export const clientId = "5640259688bc3d72b807";
export const clientSecret = "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff";
export const oauthProxy =
  "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token";

export const api = `https://api.github.com/repos/${owner}/${repo}`;

export function legacyId(id: string) {
  return id.substring(0, 50);
}

export type CommentableKind = "article" | "spark";

/**
 * Labels used to find/create the GitHub issue backing a commentable target.
 * Spark ids get a `spark/` prefix so spark issues are distinguishable from
 * article issues on GitHub.
 */
export function issueLabels(id: string, kind: CommentableKind = "article") {
  return ["Gitalk", kind === "spark" ? `spark/${legacyId(id)}` : legacyId(id)];
}

export async function github<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(path.startsWith("/") ? `${api}${path}` : path, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  // Some endpoints (e.g. DELETE reactions) return 204 with an empty body.
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("gitalk_access_token") ?? undefined;
}

export function storeToken(token: string) {
  window.localStorage.setItem("gitalk_access_token", token);
}

export function loginWithGitHub() {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: window.location.href,
    scope: "public_repo",
  }).toString();
  window.location.href = url.toString();
}

/**
 * Exchange the OAuth `code` in the current page URL for an access token.
 * Returns the token, or undefined if there is no code or the exchange failed.
 */
export async function completeOAuthRedirect(): Promise<string | undefined> {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return undefined;
  const response = await fetch(oauthProxy, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret }),
  });
  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) throw new Error("OAuth failed");
  storeToken(result.access_token);
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  window.history.replaceState(null, "", url);
  return result.access_token;
}

export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export async function fetchCurrentUser(token: string): Promise<GithubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  return (await response.json()) as GithubUser;
}

/** Find the Gitalk issue for a commentable target via the label search. */
export async function findIssue(
  articleId: string,
  token?: string,
  kind: CommentableKind = "article",
) {
  const params = new URLSearchParams({
    labels: issueLabels(articleId, kind).join(","),
    state: "all",
    per_page: "1",
  });
  const issues = await github<GithubIssue[]>(`/issues?${params}`, undefined, token);
  return issues[0] ?? null;
}
