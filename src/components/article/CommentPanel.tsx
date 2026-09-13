"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FaComments, FaGithub } from "react-icons/fa";
import { Localized, useI18n } from "src/i18n";

interface Props {
  articleId: string;
  articleTitle: string;
  language: string;
}

interface GithubComment {
  id: number;
  body: string;
  body_html?: string;
  created_at: string;
  user: { login: string; avatar_url: string; html_url: string } | null;
}

interface GithubIssue {
  number: number;
  html_url: string;
  comments: number;
}

const owner = "ddadaal";
const repo = "ddadaal.me.github.io";
const clientId = "5640259688bc3d72b807";
const clientSecret = "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff";
const oauthProxy =
  "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token";

const api = `https://api.github.com/repos/${owner}/${repo}`;

function legacyId(id: string) {
  return id.substring(0, 50);
}

function safeBodyHtml(comment: GithubComment) {
  return (
    comment.body_html ??
    comment.body.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  );
}

async function github<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${api}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  return (await response.json()) as T;
}

const CommentPanel = ({ articleId, articleTitle, language }: Props) => {
  const [issue, setIssue] = useState<GithubIssue | null>();
  const [comments, setComments] = useState<GithubComment[]>([]);
  const [body, setBody] = useState("");
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const i18n = useI18n();
  const dateLocale = language === "zh-CN" ? "zh-CN" : "en-US";
  const labels = useMemo(() => `Gitalk,${legacyId(articleId)}`, [articleId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ labels, state: "all", per_page: "1" });
      const issues = await github<GithubIssue[]>(`/issues?${params}`);
      const found = issues[0] ?? null;
      setIssue(found);
      setComments(
        found
          ? await github<GithubComment[]>(
              `/issues/${found.number}/comments?per_page=100`,
              undefined,
              token,
            )
          : [],
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [labels, token]);

  useEffect(() => {
    setToken(window.localStorage.getItem("gitalk_access_token") ?? undefined);
  }, []);

  useEffect(() => {
    if (token !== undefined || window.localStorage.getItem("gitalk_access_token") === null)
      void load();
  }, [load, token]);

  const login = () => {
    const url = new URL("https://github.com/login/oauth/authorize");
    url.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.href,
      scope: "public_repo",
    }).toString();
    window.location.href = url.toString();
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    void fetch(oauthProxy, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret }),
    })
      .then((response) => response.json() as Promise<{ access_token?: string }>)
      .then((result) => {
        if (!result.access_token) throw new Error("OAuth failed");
        window.localStorage.setItem("gitalk_access_token", result.access_token);
        setToken(result.access_token);
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(null, "", url);
      })
      .catch(() => setError(true));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim() || !issue || !token) return;
    setSubmitting(true);
    try {
      await github<GithubComment>(
        `/issues/${issue.number}/comments`,
        { method: "POST", body: JSON.stringify({ body }) },
        token,
      );
      setBody("");
      await load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 flex items-center">
        <FaComments />
        <span className="mx-2">
          <Localized id="comments.title" />
        </span>
      </h2>
      {loading ? (
        <p className="opacity-60">{i18n.translateToString("comments.loading")}</p>
      ) : undefined}
      {error ? <p className="text-error">{i18n.translateToString("comments.error")}</p> : undefined}
      {!loading && !error && !issue ? (
        <p className="opacity-60">{i18n.translateToString("comments.empty")}</p>
      ) : undefined}
      {issue ? (
        <>
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <article key={comment.id} className="card card-bordered bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={comment.user?.avatar_url ?? "https://github.com/ghost.png"}
                      alt=""
                    />
                    <a
                      className="link"
                      href={comment.user?.html_url ?? "https://github.com/ghost"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {comment.user?.login ?? "ghost"}
                    </a>
                    <time dateTime={comment.created_at} className="opacity-60">
                      {new Date(comment.created_at).toLocaleString(dateLocale)}
                    </time>
                  </div>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: safeBodyHtml(comment) }}
                  />
                </div>
              </article>
            ))}
          </div>
          {token ? (
            <form onSubmit={submit} className="space-y-2">
              <textarea
                className="textarea textarea-bordered w-full"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder={i18n.translateToString("comments.placeholder")}
                rows={4}
                maxLength={10000}
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !body.trim()}
                >
                  <FaGithub />
                  {submitting
                    ? i18n.translateToString("comments.submitting")
                    : i18n.translateToString("comments.submit")}
                </button>
                <a className="btn btn-ghost" href={issue.html_url} target="_blank" rel="noreferrer">
                  {i18n.translateToString("comments.openIssue")}
                </a>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btn-primary" onClick={login}>
                <FaGithub />
                {i18n.translateToString("comments.login")}
              </button>
              <a className="btn btn-ghost" href={issue.html_url} target="_blank" rel="noreferrer">
                {i18n.translateToString("comments.openIssue")}
              </a>
            </div>
          )}
        </>
      ) : undefined}
      {!loading && !issue ? (
        <a
          className="btn btn-ghost"
          href={`${api}/issues/new?title=${encodeURIComponent(`[COMMENT] ${articleTitle}`)}&labels=${encodeURIComponent(labels)}`}
          target="_blank"
          rel="noreferrer"
        >
          {i18n.translateToString("comments.initialize")}
        </a>
      ) : undefined}
    </div>
  );
};

export const CommentPanelWithCurrentLanguage = (props: Omit<Props, "language">) => {
  const i18n = useI18n();
  return <CommentPanel {...props} language={i18n.currentLanguage.id} />;
};
